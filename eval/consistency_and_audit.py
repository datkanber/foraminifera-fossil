#!/usr/bin/env python3
"""Internal consistency test + KB audit on the repository data.

Engine R  = current repository logic (api/src/controllers/diagnoseController.js).
Engine M  = manuscript v18 definitions (Sec. VI, Eq. 1-5, Algorithm 1).

Usage
-----
    python consistency_and_audit.py [data_dir]

    data_dir  defaults to  api/data

Outputs
-------
    consistency_summary.json   – per-module and total summary metrics
    consistency_paths.csv      – one row per (module × leaf) with both engines' results
"""

import json
import re
import csv
import collections
import itertools
import sys
import os

# Force UTF-8 stdout on Windows to handle Turkish characters in rule text
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# ──────────────────────────────────────────────────────────────────────
# 1.  Load data
# ──────────────────────────────────────────────────────────────────────

D = (sys.argv[1] if len(sys.argv) > 1 else "api/data").rstrip("/") + "/"

chars = {
    c["id"]: c["values"]
    for c in json.load(open(D + "characters.json", encoding="utf-8"))["characters"]
}

rules = json.load(open(D + "rule_chr_mapping.json", encoding="utf-8"))

MOD = {
    "agglutinated": "AGGLUTINATED",
    "porcelaneous": "PORCELANEOUS",
    "hyaline": "HYALINE",
}

# Scoring weights (Table III / Sec. VI-A)
W = {"M": 3, "D": 5, "S": 1, "C": 5}

# Cross-character implications (value_implies in diagnoseController.js)
IMPL = {
    ("CHR_11", "WELL_DEVELOPED"):          [("CHR_11", "PRESENT")],
    ("CHR_11", "WEAKLY_DEVELOPED"):        [("CHR_11", "PRESENT")],
    ("CHR_14", "STRONG"):                  [("CHR_14", "PRESENT")],
    ("CHR_14", "WEAK"):                    [("CHR_14", "PRESENT")],
    ("CHR_15", "WELL_DEVELOPED"):          [("CHR_15", "PRESENT")],
    ("CHR_15", "WEAKLY_DEVELOPED"):        [("CHR_15", "PRESENT")],
    ("CHR_17", "STRONG"):                  [("CHR_17", "PRESENT")],
    ("CHR_17", "WEAK"):                    [("CHR_17", "PRESENT")],
    ("CHR_09", "PLANISPIRAL_TO_BISERIAL"):  [("CHR_06", "PLANISPIRAL"), ("CHR_05", "BISERIAL")],
    ("CHR_09", "PLANISPIRAL_TO_UNISERIAL"): [("CHR_06", "PLANISPIRAL"), ("CHR_05", "UNISERIAL")],
    ("CHR_09", "BISERIAL_TO_UNISERIAL"):    [("CHR_05", "BISERIAL"),    ("CHR_05", "UNISERIAL")],
    ("CHR_09", "TRISERIAL_TO_BISERIAL"):    [("CHR_05", "TRISERIAL"),   ("CHR_05", "BISERIAL")],
    ("CHR_09", "TRISERIAL_TO_UNISERIAL"):   [("CHR_05", "TRISERIAL"),   ("CHR_05", "UNISERIAL")],
}

# Pre-process: build (chr_id, value) pairs for each rule, group by (module, genus)
genera = collections.defaultdict(list)
for r in rules:
    r["pairs"] = [
        (m["chr_id"], m["value"])
        for m in r["mappings"]
        if m.get("value")
    ]
    genera[(r["module"], r["genus"])].append(r)

# ──────────────────────────────────────────────────────────────────────
# 2.  Engine R  –  repository logic  (diagnoseController.js faithful)
# ──────────────────────────────────────────────────────────────────────

def holds_R(obs, c, v):
    """
    Does observation set `obs` support (c, v)?
    Returns True / False / None (neutral).
    Mirrors valueHolds() in diagnoseController.js:
      - check implication from ANY observed character
      - if chr not observed AND not implied -> None
      - if observed value matches or implied -> True, else False
    """
    implied = any(
        (c, v) in IMPL.get((oc, ov), [])
        for oc, ov in obs.items()
    )
    if c not in obs:
        return True if implied else None
    return True if (obs[c] == v or implied) else False


def verdict_R(obs, r):
    """Evaluate one rule against an observation dict (Engine R)."""
    if not r["pairs"]:
        return "NEUTRAL"
    conf = 0
    for c, v in r["pairs"]:
        h = holds_R(obs, c, v)
        if h is False:
            return "MISMATCH"
        if h:
            conf += 1
    return "MATCH" if conf else "NEUTRAL"


def engine_R(obs, module):
    """
    Score all genera in `module` using Engine R.
    Returns (active_ranking, all_results, status, top_genus).
    """
    res = []
    for (m, g), rs in genera.items():
        if m != module:
            continue
        s = 0
        mm = 0          # mandatory matched count
        mv = False       # mandatory violated?
        dm = []          # diagnostic matched texts
        du = 0           # diagnostic unobservable count
        nc = 0           # contradictions matched
        for r in rs:
            v = verdict_R(obs, r)
            L = r["level"]
            if L == "C":
                if v == "MATCH":
                    s -= 5
                    nc += 1
                continue
            if L == "M":
                if v == "MATCH":
                    mm += 1
                    s += 3
                elif v == "MISMATCH":
                    mv = True
                continue
            if v == "MATCH":
                s += W[L]
                if L == "D":
                    dm.append(r["text"])
            elif v == "NEUTRAL" and L == "D":
                du += 1

        excl = mv or (nc >= 1 and s < 0)
        res.append(dict(g=g, s=s, mm=mm, dm=dm, du=du, nc=nc, excl=excl))

    # Rank active (non-excluded) genera by (score desc, diag-count desc)
    act = sorted(
        [x for x in res if not x["excl"]],
        key=lambda x: (-x["s"], -len(x["dm"])),
    )

    # nObserved - repository counts CHR_01 but not CHR_21
    n = sum(1 for c in obs if c != "CHR_21")

    if not act:
        return act, res, ("NO_MATCH" if n >= 3 else "INDETERMINATE"), None

    t = act[0]
    ru = act[1] if len(act) > 1 else None

    # Separation: runner-up is None, or top has a unique diagnostic AND score gap >= 1
    sep = ru is None or (
        any(d not in ru["dm"] for d in t["dm"]) and t["s"] - ru["s"] >= 1
    )

    if n < 2 or t["mm"] == 0:
        st = "INDETERMINATE"
    elif t["dm"] and t["nc"] == 0 and sep:
        st = "CONFIRMED"
    elif t["nc"] == 0 and t["du"] > 0 and not t["dm"]:
        st = "PROBABLE"
    elif t["nc"] == 0 and not sep:
        st = "CANDIDATE"
    else:
        st = "PROBABLE" if t["nc"] == 0 else "CANDIDATE"

    return act, res, st, t["g"]


# ──────────────────────────────────────────────────────────────────────
# 3.  Engine M  –  manuscript v18  (Sec. VI, Eq. 1-5, Algorithm 1)
# ──────────────────────────────────────────────────────────────────────

def H(obs):
    """
    Build a multi-valued observation map with implications expanded (Eq. 1).
    CHR_21 (section orientation) is excluded from scoring.
    """
    h = collections.defaultdict(set)
    for c, v in obs.items():
        if c == "CHR_21":
            continue
        h[c].add(v)
        for ic, iv in IMPL.get((c, v), []):
            h[ic].add(iv)
    return h


def verdict_M(h, r):
    """
    Evaluate one rule against the expanded observation map (Engine M).
    Returns (verdict, held_pairs).
    """
    if not r["pairs"]:
        return "NEUTRAL", set()
    # Group rule pairs by character
    groups = collections.defaultdict(set)
    for c, v in r["pairs"]:
        groups[c].add(v)
    anyhold = False
    held = set()
    for c, vs in groups.items():
        if h.get(c):
            hit = vs & h[c]
            if not hit:
                return "MISMATCH", set()
            anyhold = True
            held |= {(c, v) for v in hit}
    return ("MATCH", held) if anyhold else ("NEUTRAL", set())


def engine_M(obs, module):
    """
    Score all genera in `module` using Engine M (manuscript v18).
    Returns (active_ranking, all_results, status, top_genus).
    """
    h = H(obs)
    res = []
    for (m, g), rs in genera.items():
        if m != module:
            continue
        s = 0
        mv = False          # mandatory violated
        nc = 0              # contradictions matched
        nd = 0              # diagnostic matched count
        Dset = set()        # set of held (chr, val) pairs from diagnostic rules
        m_non01 = False     # mandatory match on a character other than CHR_01
        d_neutral_mapped = False  # a diagnostic rule with mappings is NEUTRAL
        for r in rs:
            v, held = verdict_M(h, r)
            L = r["level"]
            if L == "C":
                if v == "MATCH":
                    nc += 1
                continue
            if v == "MATCH":
                s += W[L]
                if L == "M" and any(c != "CHR_01" for c, _ in held):
                    m_non01 = True
                if L == "D":
                    nd += 1
                    Dset |= held
            if L == "M" and v == "MISMATCH":
                mv = True
            if L == "D" and v == "NEUTRAL" and r["pairs"]:
                d_neutral_mapped = True

        s -= 5 * nc
        excl = mv or (nc >= 1 and s < 0)
        res.append(dict(
            g=g, s=s, nd=nd, D=Dset, nc=nc,
            m01=m_non01, dnm=d_neutral_mapped, excl=excl,
        ))

    act = sorted(
        [x for x in res if not x["excl"]],
        key=lambda x: (-x["s"], -x["nd"]),
    )

    # n counts characters excluding CHR_21 AND CHR_01 (v18 Algorithm 1 line 4)
    n = sum(1 for c in obs if c not in ("CHR_21", "CHR_01"))

    if not act:
        return act, res, ("NO_MATCH" if n >= 3 else "INDETERMINATE"), None

    g1 = act[0]
    g2 = act[1] if len(act) > 1 else None

    # Algorithm 1 lines 5-6: need >= 2 informative characters + mandatory non-CHR_01
    if n < 2 or not g1["m01"]:
        return act, res, "INDETERMINATE", None

    hasD = bool(g1["D"])
    noC = g1["nc"] == 0

    # Separation: score gap >= 1 AND diagnostic set is NOT a subset of runner-up's
    sep = True if g2 is None else (
        g1["s"] - g2["s"] >= 1 and not g1["D"] <= g2["D"]
    )

    # Algorithm 1 lines 8-16
    if hasD and noC and sep:
        return act, res, "CONFIRMED", g1["g"]
    if g2 is not None and g1["s"] == g2["s"]:
        return act, res, "CANDIDATE", g1["g"]
    if noC and not hasD and g1["dnm"]:
        return act, res, "PROBABLE", g1["g"]
    if noC and not sep:
        return act, res, "CANDIDATE", g1["g"]
    return act, res, ("PROBABLE" if noC else "CANDIDATE"), g1["g"]


# ──────────────────────────────────────────────────────────────────────
# 4.  Decision-tree path enumeration
# ──────────────────────────────────────────────────────────────────────

def paths(module):
    """
    Walk every root-to-leaf path in the decision tree for `module`.
    Returns (leaf_paths, out_of_vocab_answers, node_count).
    """
    t = json.load(open(D + "decision_tree_%s.json" % module, encoding="utf-8"))
    nodes = {n["id"]: n for n in t["nodes"]}
    out = []
    oov = []

    def walk(nid, obs, depth, trail):
        n = nodes[nid]
        for a in n["answers"]:
            o = dict(obs)
            c = n.get("chr_id")
            v = a["value"]
            if c and v != "*":
                if v in chars.get(c, []):
                    o[c] = v
                elif "maps_to" not in a:
                    oov.append((nid, c, v))
            # Handle explicit maps_to
            for mc, mv in (a.get("maps_to") or {}).items():
                if mv != "*":
                    o[mc] = mv
            # Handle positive constraints
            for cc, cv in (a.get("constraint") or {}).items():
                if not cv.startswith("!"):
                    o[cc] = cv
            nxt = a["next"]
            if nxt.startswith("GENUS:"):
                out.append((nxt[6:], o, depth + 1, trail + [nid]))
            elif nxt.startswith(("INDETERMINATE:", "REDIRECT:")):
                pass  # terminal but no genus leaf
            else:
                walk(nxt, o, depth + 1, trail + [nid])

    walk(t["entry"], {"CHR_01": MOD[module]}, 0, [])
    return out, oov, len(t["nodes"])


def rank(act, g, key):
    """Return (1-based rank, is_tied) of genus `g` in active list by `key`."""
    me = [x for x in act if x["g"] == g]
    if not me:
        return None, False
    s = me[0][key]
    r = 1 + sum(1 for x in act if x[key] > s)
    tied = sum(1 for x in act if x[key] == s) > 1
    return r, tied


# ──────────────────────────────────────────────────────────────────────
# 5.  KB audit helpers
# ──────────────────────────────────────────────────────────────────────

def audit_rules():
    """
    Audit the rule_chr_mapping.json for common issues.
    Returns a dict of audit findings.
    """
    findings = {
        "inverted_mappings": [],
        "contradictory_duplicates": [],     # C rule repeats a positive rule
        "diagnostic_mandatory_overlap": [], # D rule maps same (chr,val) as M rule
        "genera_no_scored_diagnostic": [],  # genus has no scorable D rule
        "multi_mapping_rules": [],          # rules with >= 2 mappings
        "unmapped_rules_with_text": [],     # rules with text but no mappings
    }

    # Inverted-mapping detector: text says "absent" but maps to PRESENT, etc.
    INVERSION_PATTERNS = [
        (r"\babsent\b", "PRESENT"),
        (r"\bno\b",     "PRESENT"),
        (r"\bnot\b",    "PRESENT"),
        (r"\babsent\b", "SUBDIVIDED"),
        (r"\bsimple\b", "SUBDIVIDED"),
        (r"\bsimple\b", "COMPLEX"),
        (r"\babsent\b", "MULTICHAMBERED"),
    ]

    for r in rules:
        text_lower = r["text"].lower()
        for pat, val in INVERSION_PATTERNS:
            if re.search(pat, text_lower):
                for m in r["mappings"]:
                    if m.get("value") == val:
                        findings["inverted_mappings"].append(
                            f'{r["rule_key"]}: text="{r["text"]}" -> {m["chr_id"]}={val}'
                        )

    # Per-genus audit
    for (mod, genus), rs in genera.items():
        pos_pairs = set()
        c_pairs = set()
        d_scored = 0
        for r in rs:
            pairs = set(tuple(p) for p in r["pairs"])
            if r["level"] in ("M", "D", "S"):
                pos_pairs |= pairs
            if r["level"] == "C":
                c_pairs |= pairs
            if r["level"] == "D" and r["pairs"]:
                d_scored += 1
            if len(r["pairs"]) >= 2:
                findings["multi_mapping_rules"].append(
                    f'{r["rule_key"]}: {r["pairs"]}'
                )
            if not r["mappings"] and r["text"]:
                findings["unmapped_rules_with_text"].append(
                    f'{r["rule_key"]}: "{r["text"]}"'
                )

        # C rule that repeats a positive pair
        overlap = c_pairs & pos_pairs
        if overlap:
            findings["contradictory_duplicates"].append(
                f"{genus}: C overlaps M/D/S on {overlap}"
            )

        # D rule that maps same (chr,val) as an M rule
        m_pairs = set()
        d_pairs = set()
        for r in rs:
            if r["level"] == "M":
                m_pairs |= set(tuple(p) for p in r["pairs"])
            if r["level"] == "D":
                d_pairs |= set(tuple(p) for p in r["pairs"])
        md_overlap = m_pairs & d_pairs
        if md_overlap:
            findings["diagnostic_mandatory_overlap"].append(
                f"{genus}: D intersection M on {md_overlap}"
            )

        if d_scored == 0:
            findings["genera_no_scored_diagnostic"].append(f"{genus} ({mod})")

    return findings


# ──────────────────────────────────────────────────────────────────────
# 6.  Run consistency test + audit
# ──────────────────────────────────────────────────────────────────────

def find_exclusion_rules(obs, module, genus):
    """
    Identify which rules cause the leaf genus to be excluded.
    Returns a list of exclusion reasons.
    """
    reasons = []
    rs = genera.get((module, genus), [])
    h = H(obs)
    for r in rs:
        v_r = verdict_R(obs, r)
        v_m, _ = verdict_M(h, r)
        if r["level"] == "M" and (v_r == "MISMATCH" or v_m == "MISMATCH"):
            reasons.append(f'{r["code"]}:{r["text"]}')
    return reasons


def main():
    summary = {}
    all_paths_data = []  # for CSV

    # Cache tree paths per module to avoid re-parsing
    tree_paths = {}
    for module in MOD:
        tree_paths[module] = paths(module)

    for module in MOD:
        ps, oov, nq = tree_paths[module]

        # Run Engine R and build CSV rows
        row_R = collections.Counter(paths=len(ps))
        states_R = collections.Counter()

        for leaf, obs, depth, trail in ps:
            act, res, st, top = engine_R(obs, MOD[module])
            r_val, tied = rank(act, leaf, "s")
            states_R[st] += 1

            if r_val is None:
                row_R["excluded"] += 1
            else:
                if r_val == 1 and not tied:
                    row_R["rank1_unique"] += 1
                if r_val == 1 and tied:
                    row_R["rank1_tied"] += 1
                if r_val <= 3:
                    row_R["top3"] += 1

            if st == "CONFIRMED":
                row_R["conf_total"] += 1
                if top == leaf:
                    row_R["conf_correct"] += 1

            # Collect per-path data for CSV
            obs_str = "; ".join(f"{k}={v}" for k, v in sorted(obs.items()))
            n_obs_excl_chr01 = sum(
                1 for c in obs if c not in ("CHR_21", "CHR_01")
            )
            excl_rules = find_exclusion_rules(obs, MOD[module], leaf)

            all_paths_data.append({
                "module": module,
                "leaf_genus": leaf,
                "observations": obs_str,
                "n_obs_excl_CHR01": n_obs_excl_chr01,
                "repo_state": st,
                "repo_top": top or "",
                "repo_leaf_rank": r_val if r_val else "excluded",
                "v18_state": "",
                "v18_top": "",
                "v18_leaf_rank": "",
                "leaf_excluded": r_val is None,
                "leaf_exclusion_rules": " | ".join(excl_rules),
            })

        summary[(module, "R")] = (row_R, states_R)

        # Run Engine M and fill v18 columns
        row_M = collections.Counter(paths=len(ps))
        states_M = collections.Counter()

        # Find starting index for this module's paths in all_paths_data
        offset = sum(len(tree_paths[m][0]) for m in list(MOD.keys()) if list(MOD.keys()).index(m) < list(MOD.keys()).index(module))

        for idx, (leaf, obs, depth, trail) in enumerate(ps):
            act, res, st, top = engine_M(obs, MOD[module])
            r_val, tied = rank(act, leaf, "s")
            states_M[st] += 1

            if r_val is None:
                row_M["excluded"] += 1
            else:
                if r_val == 1 and not tied:
                    row_M["rank1_unique"] += 1
                if r_val == 1 and tied:
                    row_M["rank1_tied"] += 1
                if r_val <= 3:
                    row_M["top3"] += 1

            if st == "CONFIRMED":
                row_M["conf_total"] += 1
                if top == leaf:
                    row_M["conf_correct"] += 1

            all_paths_data[offset + idx]["v18_state"] = st
            all_paths_data[offset + idx]["v18_top"] = top or ""
            all_paths_data[offset + idx]["v18_leaf_rank"] = r_val if r_val else "excluded"

        summary[(module, "M")] = (row_M, states_M)

        summary[(module, "meta")] = dict(
            questions=nq,
            paths=len(ps),
            genera=len({p[0] for p in ps}),
            maxdepth=max(p[2] for p in ps),
            oov=oov,
        )

    # ── Print summary ────────────────────────────────────────────────
    for module in MOD:
        print(module.upper(), summary[(module, "meta")])
        for name in "RM":
            row, st = summary[(module, name)]
            print("  engine", name, dict(row), dict(st))

    tot = {n: collections.Counter() for n in "RM"}
    tst = {n: collections.Counter() for n in "RM"}
    for module in MOD:
        for n in "RM":
            tot[n].update(summary[(module, n)][0])
            tst[n].update(summary[(module, n)][1])
    for n in "RM":
        print("TOTAL engine", n, dict(tot[n]), dict(tst[n]))

    # ── Audit ────────────────────────────────────────────────────────
    print("\n" + "=" * 72)
    print("KB AUDIT")
    print("=" * 72)
    audit = audit_rules()
    for key, items in audit.items():
        print(f"\n-- {key} ({len(items)} findings) --")
        for item in items[:30]:
            print(f"  * {item}")
        if len(items) > 30:
            print(f"  ... and {len(items) - 30} more")

    # ── Write JSON summary ───────────────────────────────────────────
    json.dump(
        {
            f"{k[0]}|{k[1]}": (v if k[1] == "meta" else [dict(v[0]), dict(v[1])])
            for k, v in summary.items()
        },
        open("eval/results/consistency_summary.json", "w", encoding="utf-8"),
        indent=1,
        default=str,
    )
    print("\n-> eval/results/consistency_summary.json written")

    # ── Write CSV ────────────────────────────────────────────────────
    fieldnames = [
        "module", "leaf_genus", "observations", "n_obs_excl_CHR01",
        "repo_state", "repo_top", "repo_leaf_rank",
        "v18_state", "v18_top", "v18_leaf_rank",
        "leaf_excluded", "leaf_exclusion_rules",
    ]
    with open("eval/results/consistency_paths.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_paths_data)
    print(f"-> eval/results/consistency_paths.csv written ({len(all_paths_data)} rows)")

    if "--export-paths" in sys.argv:
        # Create a cleaner list for the JS test to use
        export_data = []
        for d in all_paths_data:
            export_data.append({
                "module": d["module"],
                "leaf_genus": d["leaf_genus"],
                "observations": d["observations"],
                "expected_state": d["v18_state"],
                "expected_top": d["v18_top"],
                "expected_excluded": d["leaf_excluded"]
            })
        json.dump(
            export_data,
            open("eval/results/paths.json", "w", encoding="utf-8"),
            indent=2
        )
        print(f"-> eval/results/paths.json written ({len(export_data)} paths)")


if __name__ == "__main__":
    main()
