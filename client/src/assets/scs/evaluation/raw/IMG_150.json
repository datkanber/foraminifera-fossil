{
  "imageId": "IMG_150",
  "imageSha256": "46f2c7796d0a4e3af210652a0c940b27b22901330b7864a5f3d6a235949ee484",
  "configHash": "b8e8953fc0ead02af988f5e02aa1ead1c488ec3445cc5cb7f8c83f26134fe534",
  "success": true,
  "elapsedMs": 8833,
  "attempts": [
    {
      "attempt": 1,
      "at": "2026-11-09T09:30:32.645Z",
      "httpStatus": 200,
      "imageSha256": "46f2c7796d0a4e3af210652a0c940b27b22901330b7864a5f3d6a235949ee484",
      "request": {
        "model": "gemini-3.5-flash-lite",
        "generationConfig": {
          "temperature": 0.2,
          "responseMimeType": "application/json"
        },
        "text": "You are the vision observer for GeoKnow / ESOGU \"foraminifera-fossil\".\nYou are NOT a taxonomic authority and you do NOT replace the project's scoring engine.\n\nGoal: look at the attached optical image(s) of a microfossil (thin section or reflected-light photomicrograph) and fill the project's character sheet CHR_01–CHR_21.\n\nHard rules\n1. Observe first. Identify only as a tentative suggestion.\n2. Never invent a character. If it is not clearly visible, use state NOT_OBSERVABLE. If visible but ambiguous, use UNCERTAIN.\n3. NOT_OBSERVABLE is not ABSENT. Do not mark ABSENT unless the relevant area is exposed and the feature is clearly missing.\n4. Keep CHR_05 and CHR_06 separate:\n   - CHR_05 = serial arrangement only (UNISERIAL, BISERIAL, TRISERIAL, QUINQUELOCULINE, TRILOCULINE, BILOCULINE, ANNULAR, CYCLIC, IRREGULAR_SERIAL, OTHER)\n   - CHR_06 = coiling (PLANISPIRAL, TROCHOSPIRAL, STREPTOSPIRAL, GLOMOSPIRAL, IRREGULAR_COILING, UNCOILED)\n5. Do not force a species name. Prefer genus or morphogroup. If evidence is weak, identification_status = INDETERMINATE.\n6. This tool is academic and non-commercial. Do not present the answer as an official Foraminifera.eu, WoRMS, or museum determination.\n7. Reply with VALID JSON only. No markdown, no preamble, no trailing text.\n8. Allowed observation states: PRESENT, ABSENT, NOT_OBSERVABLE, UNCERTAIN.\n9. Allowed identification_status values: CONFIRMED_GENUS, PROBABLE_GENUS, CANDIDATE_GENUS, INDETERMINATE, NO_MATCH_WITHIN_CORE_TAXA.\n10. If the object is not a foraminifer, set object_is_foraminifer=false and fill every CHR with NOT_OBSERVABLE / null.\n\nAllowed values (use ONLY these codes)\n\nCHR_01 Test composition: AGGLUTINATED | PORCELANEOUS | HYALINE | UNCERTAIN\nCHR_02 Test shape: GLOBULAR | SAC_LIKE | TUBULAR | ELONGATE | FUSIFORM | OVOID | LENTICULAR | DISCOIDAL | FLATTENED | CONICAL | HIGH_CONICAL | FLABELLIFORM | STELLATE | IRREGULAR | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_03 Septation: PRESENT | ABSENT | NOT_OBSERVABLE | UNCERTAIN\nCHR_04 Chamber number organization: UNDIVIDED | MULTICHAMBERED | NOT_OBSERVABLE | UNCERTAIN\nCHR_05 Chamber arrangement: UNISERIAL | BISERIAL | TRISERIAL | QUINQUELOCULINE | TRILOCULINE | BILOCULINE | ANNULAR | CYCLIC | IRREGULAR_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_06 Coiling pattern: PLANISPIRAL | TROCHOSPIRAL | STREPTOSPIRAL | GLOMOSPIRAL | IRREGULAR_COILING | UNCOILED | NOT_OBSERVABLE | UNCERTAIN\nCHR_07 Coiling plane: SINGLE_PLANE | CHANGING_PLANES | MULTIDIRECTIONAL | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_08 Involution/evolution: INVOLUTE | SEMI_INVOLUTE | EVOLUTE | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_09 Ontogenetic arrangement change: NONE | PLANISPIRAL_TO_UNISERIAL | PLANISPIRAL_TO_BISERIAL | BISERIAL_TO_UNISERIAL | TRISERIAL_TO_BISERIAL | TRISERIAL_TO_UNISERIAL | COILED_TO_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_10 Internal complexity: SIMPLE | SUBDIVIDED | COMPLEX | RETICULATE | LABYRINTHIC | NOT_OBSERVABLE | UNCERTAIN\nCHR_11 Secondary chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_12 Embryonic apparatus: SIMPLE | BILOCULAR | MULTILOCULAR | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_13 Radial/internal partitions: ABSENT | RADIAL | VERTICAL | SUBEPIDERMAL | RETICULATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_14 Pillars: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_15 Lateral chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_16 Aperture type: TERMINAL | INTERIOMARGINAL | BASAL | MULTIPLE | SLIT_LIKE | CRIBRATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_17 Marginal cord: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_18 Septal filaments: ABSENT | SIMPLE | CURVED | WAVY | RETICULATE | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_19 Attachment mode: FREE | ATTACHED | NOT_OBSERVABLE | UNCERTAIN\nCHR_20 Dimorphism: PRESENT | ABSENT | MEGALOSPHERIC_FORM | MICROSPHERIC_FORM | NOT_OBSERVABLE | UNCERTAIN\nCHR_21 Section orientation: AXIAL | EQUATORIAL | OBLIQUE | TANGENTIAL | UNKNOWN\n\nObservation object format for every CHR:\n{\"value\": \"<CODE or null>\", \"state\": \"PRESENT|ABSENT|NOT_OBSERVABLE|UNCERTAIN\", \"reason\": \"one short sentence\"}\n\nWhen state is NOT_OBSERVABLE or UNCERTAIN, value may be null.\nFor CHR_01, if composition cannot be judged from lighting, value=UNCERTAIN and state=UNCERTAIN.\nFor CHR_21, state is usually PRESENT and value is the section type; use UNKNOWN if the view is external, not a thin section.\n\nContext from the user:\n- locality: unknown\n- age / stratigraphy: unknown\n- lighting / magnification: unknown\n- scale: unknown\n- views provided: unknown\n\nReturn exactly this JSON schema:\n\n{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"good|fair|poor\",\n  \"image_type\": \"thin_section|reflected_light|sem|mixed|unknown\",\n  \"observations\": {\n    \"CHR_01\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_02\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_03\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_04\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_05\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_06\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_07\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_08\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_09\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_10\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_11\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_12\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_13\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_14\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_15\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_16\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_17\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_18\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_19\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_20\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_21\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"}\n  },\n  \"module\": \"AGGLUTINATED|PORCELANEOUS|HYALINE|UNKNOWN\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"INDETERMINATE\",\n    \"best_open_id\": \"\",\n    \"candidate_genera\": [{\"name\": \"\", \"confidence\": \"low|moderate|high\", \"why\": \"\"}],\n    \"lookalikes\": [],\n    \"why_not_species_level\": \"\"\n  },\n  \"student_explanation_en\": \"Max 120 words, simple English.\",\n  \"student_explanation_tr\": \"En fazla 120 kelime, sade Türkçe.\",\n  \"expert_checklist_tr\": [\"uzmanın kontrol edeceği 3-5 nokta\"],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
        "imageSha256": "46f2c7796d0a4e3af210652a0c940b27b22901330b7864a5f3d6a235949ee484",
        "mimeType": "image/png"
      },
      "providerStatus": 200,
      "providerResponse": {
        "candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"fair\",\n  \"image_type\": \"thin_section\",\n  \"observations\": {\n    \"CHR_01\": {\"value\": \"HYALINE\", \"state\": \"PRESENT\", \"reason\": \"The microgranular or microcrystalline wall structure visible in thin section suggests a calcaceous hyaline or imperforate-porcelaneous variant, tentatively placed in larger benthic groups.\"},\n    \"CHR_02\": {\"value\": \"LENTICULAR\", \"state\": \"PRESENT\", \"reason\": \"The overall outline in this section appears subcircular to biconvex/lenticular.\"},\n    \"CHR_03\": {\"value\": \"PRESENT\", \"state\": \"PRESENT\", \"reason\": \"Septa separating chambers are clearly visible inside the test.\"},\n    \"CHR_04\": {\"value\": \"MULTICHAMBERED\", \"state\": \"PRESENT\", \"reason\": \"Numerous chambers are clearly developed throughout the test.\"},\n    \"CHR_05\": {\"value\": \"OTHER\", \"state\": \"PRESENT\", \"reason\": \"Chambers follow a complex arrangement associated with spiral and subdivided structures.\"},\n    \"CHR_06\": {\"value\": \"TROCHOSPIRAL\", \"state\": \"PRESENT\", \"reason\": \"The coiling style exhibits a trochospiral or spiral arrangement in section.\"},\n    \"CHR_07\": {\"value\": \"SINGLE_PLANE\", \"state\": \"UNCERTAIN\", \"reason\": \"Plane of coiling cannot be definitively confirmed as purely single plane from this single view.\"},\n    \"CHR_08\": {\"value\": \"INVOLUTE\", \"state\": \"UNCERTAIN\", \"reason\": \"Appears largely involute but difficult to be absolute without serial sections.\"},\n    \"CHR_09\": {\"value\": \"NONE\", \"state\": \"PRESENT\", \"reason\": \"No major ontogenetic stage change is evident.\"},\n    \"CHR_10\": {\"value\": \"COMPLEX\", \"state\": \"PRESENT\", \"reason\": \"Complex internal chamber subdivision and partitions are visible.\"},\n    \"CHR_11\": {\"value\": \"WELL_DEVELOPED\", \"state\": \"PRESENT\", \"reason\": \"Secondary chamberlets or subdivisions are well-formed.\"},\n    \"CHR_12\": {\"value\": \"SIMPLE\", \"state\": \"UNCERTAIN\", \"reason\": \"Embryonic apparatus is obscured by subsequent chamber growth.\"},\n    \"CHR_13\": {\"value\": \"SUBEPIDERMAL\", \"state\": \"PRESENT\", \"reason\": \"Subepidermal network or partitions are present beneath the outer wall.\"},\n    \"CHR_14\": {\"value\": \"ABSENT\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Distinct pillars are not clearly discernible in this orientation.\"},\n    \"CHR_15\": {\"value\": \"PRESENT\", \"state\": \"PRESENT\", \"reason\": \"Lateral chamberlets or similar subdivisions can be observed.\"},\n    \"CHR_16\": {\"value\": \"NOT_OBSERVABLE\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Apertural face is not exposed in this section plane.\"},\n    \"CHR_17\": {\"value\": \"ABSENT\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Marginal cord features are not distinctly visible.\"},\n    \"CHR_18\": {\"value\": \"ABSENT\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Surface septal filaments cannot be observed in internal thin section.\"},\n    \"CHR_19\": {\"value\": \"FREE\", \"state\": \"UNCERTAIN\", \"reason\": \"Test appears free, but attachment cannot be entirely ruled out.\"},\n    \"CHR_20\": {\"value\": \"NOT_OBSERVABLE\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Dimorphism cannot be determined from a single random section.\"},\n    \"CHR_21\": {\"value\": \"OBLIQUE\", \"state\": \"PRESENT\", \"reason\": \"The section cuts the test obliquely relative to the coiling axis.\"}\n  },\n  \"module\": \"HYALINE\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"CANDIDATE_GENUS\",\n    \"best_open_id\": \"Orbitolinid or complex rotaliid benthic forifer\",\n    \"candidate_genera\": [{\"name\": \"Orbitolina\", \"confidence\": \"low\", \"why\": \"Complex subepidermal partitioning visible in section resembles larger benthic foraminifera.\"}],\n    \"lookalikes\": [\"Complex rotaliids\", \"Mesorbitolina\"],\n    \"why_not_species_level\": \"Section is oblique, obscuring key diagnostic embryonic and apertural features required for species identification.\"\n  },\n  \"student_explanation_en\": \"This is an optical thin section of a complex larger benthic foraminifer. It shows a multi-chambered test with internal partitions and subepidermal chamberlets. Because the section is oblique, species-level identification is not possible.\",\n  \"student_explanation_tr\": \"Bu görüntü, karmaşık büyük bentik foraminifere ait bir ince kesittir. İç bölmeler ve subepidermal odacıklar içeren çok odacıklı bir kabuk gösterir. Kesit eğik olduğu için tür düzeyinde teşhis yapılamaz.\",\n  \"expert_checklist_tr\": [\n    \"İnce kesit düzleminin (eksenel/eğik) doğrulanması\",\n    \"Subepidermal ağ yapısının ve bölmelerin incelenmesi\",\n    \"İlk odacık (embriyonik aparat) görünürlüğünün kontrolü\"\n  ],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
                  "thoughtSignature": "EmAKXgFpFH0THYJ0ny8ZhXYVibDSNio2bdeD5i/jHyHGRrrXRnt2A+R//WORwNh8yWTCQRdQkRN5t463YyrxW5ghhLJmzx+BxlbsPaKBSHZ+5C0qHoAnwRRZlgDdnmRlpaE="
                }
              ],
              "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 3271,
          "candidatesTokenCount": 1266,
          "totalTokenCount": 4537,
          "promptTokensDetails": [
            {
              "modality": "TEXT",
              "tokenCount": 2183
            },
            {
              "modality": "IMAGE",
              "tokenCount": 1088
            }
          ],
          "serviceTier": "standard"
        },
        "modelVersion": "gemini-3.5-flash-lite",
        "responseId": "tZLxauSLC56kvdIP_feT0AI"
      },
      "retryAfter": null
    }
  ],
  "response": {
    "success": true,
    "model": "gemini-3.5-flash-lite",
    "observation": {
      "object_is_foraminifer": true,
      "image_quality": "fair",
      "image_type": "thin_section",
      "observations": {
        "CHR_01": {
          "value": "HYALINE",
          "state": "PRESENT",
          "reason": "The microgranular or microcrystalline wall structure visible in thin section suggests a calcaceous hyaline or imperforate-porcelaneous variant, tentatively placed in larger benthic groups."
        },
        "CHR_02": {
          "value": "LENTICULAR",
          "state": "PRESENT",
          "reason": "The overall outline in this section appears subcircular to biconvex/lenticular."
        },
        "CHR_03": {
          "value": "PRESENT",
          "state": "PRESENT",
          "reason": "Septa separating chambers are clearly visible inside the test."
        },
        "CHR_04": {
          "value": "MULTICHAMBERED",
          "state": "PRESENT",
          "reason": "Numerous chambers are clearly developed throughout the test."
        },
        "CHR_05": {
          "value": "OTHER",
          "state": "PRESENT",
          "reason": "Chambers follow a complex arrangement associated with spiral and subdivided structures."
        },
        "CHR_06": {
          "value": "TROCHOSPIRAL",
          "state": "PRESENT",
          "reason": "The coiling style exhibits a trochospiral or spiral arrangement in section."
        },
        "CHR_07": {
          "value": "SINGLE_PLANE",
          "state": "PRESENT",
          "reason": "Plane of coiling cannot be definitively confirmed as purely single plane from this single view."
        },
        "CHR_08": {
          "value": "INVOLUTE",
          "state": "PRESENT",
          "reason": "Appears largely involute but difficult to be absolute without serial sections."
        },
        "CHR_09": {
          "value": "NONE",
          "state": "PRESENT",
          "reason": "No major ontogenetic stage change is evident."
        },
        "CHR_10": {
          "value": "COMPLEX",
          "state": "PRESENT",
          "reason": "Complex internal chamber subdivision and partitions are visible."
        },
        "CHR_11": {
          "value": "WELL_DEVELOPED",
          "state": "PRESENT",
          "reason": "Secondary chamberlets or subdivisions are well-formed."
        },
        "CHR_12": {
          "value": "SIMPLE",
          "state": "PRESENT",
          "reason": "Embryonic apparatus is obscured by subsequent chamber growth."
        },
        "CHR_13": {
          "value": "SUBEPIDERMAL",
          "state": "PRESENT",
          "reason": "Subepidermal network or partitions are present beneath the outer wall."
        },
        "CHR_14": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "Distinct pillars are not clearly discernible in this orientation."
        },
        "CHR_15": {
          "value": "PRESENT",
          "state": "PRESENT",
          "reason": "Lateral chamberlets or similar subdivisions can be observed."
        },
        "CHR_16": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Apertural face is not exposed in this section plane."
        },
        "CHR_17": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "Marginal cord features are not distinctly visible."
        },
        "CHR_18": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "Surface septal filaments cannot be observed in internal thin section."
        },
        "CHR_19": {
          "value": "FREE",
          "state": "PRESENT",
          "reason": "Test appears free, but attachment cannot be entirely ruled out."
        },
        "CHR_20": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Dimorphism cannot be determined from a single random section."
        },
        "CHR_21": {
          "value": "OBLIQUE",
          "state": "PRESENT",
          "reason": "The section cuts the test obliquely relative to the coiling axis."
        }
      },
      "module": "HYALINE",
      "vlm_suggestion": {
        "identification_status": "CANDIDATE_GENUS",
        "best_open_id": "Orbitolinid or complex rotaliid benthic forifer",
        "candidate_genera": [
          {
            "name": "Orbitolina",
            "confidence": "low",
            "why": "Complex subepidermal partitioning visible in section resembles larger benthic foraminifera."
          }
        ],
        "lookalikes": [
          "Complex rotaliids",
          "Mesorbitolina"
        ],
        "why_not_species_level": "Section is oblique, obscuring key diagnostic embryonic and apertural features required for species identification."
      },
      "student_explanation_en": "This is an optical thin section of a complex larger benthic foraminifer. It shows a multi-chambered test with internal partitions and subepidermal chamberlets. Because the section is oblique, species-level identification is not possible.",
      "student_explanation_tr": "Bu görüntü, karmaşık büyük bentik foraminifere ait bir ince kesittir. İç bölmeler ve subepidermal odacıklar içeren çok odacıklı bir kabuk gösterir. Kesit eğik olduğu için tür düzeyinde teşhis yapılamaz.",
      "expert_checklist_tr": [
        "İnce kesit düzleminin (eksenel/eğik) doğrulanması",
        "Subepidermal ağ yapısının ve bölmelerin incelenmesi",
        "İlk odacık (embriyonik aparat) görünürlüğünün kontrolü"
      ],
      "disclaimer_tr": "Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir."
    },
    "score": null
  },
  "score": {
    "module": "HYALINE",
    "status": "CANDIDATE_GENUS",
    "identification": "Lockhartia",
    "confidenceNote": "POOR_SEPARATION",
    "ranking": [
      {
        "genus": "Lockhartia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 14,
        "mandatoryTotal": 3,
        "mandatoryMatched": 3,
        "mandatoryViolated": [],
        "diagnosticMatched": [
          "conical/conico-lenticular profile"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          },
          {
            "level": "D",
            "text": "conical/conico-lenticular profile",
            "detail": "CHR_02=LENTICULAR"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "strong dorsal/ventral asymmetry"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Kathina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 11,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [
          "compact lenticular test"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          },
          {
            "level": "D",
            "text": "compact lenticular test",
            "detail": "CHR_02=LENTICULAR"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "larger rotaliid architecture"
          },
          {
            "level": "D",
            "text": "strong central/umbilical thickening"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Daviesina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 3,
        "mandatoryMatched": 3,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "rotaliid/trochospiral architecture",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "differentiated peripheral internal zone"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Laffitteina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 3,
        "mandatoryMatched": 3,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          },
          {
            "level": "M",
            "text": "multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "robust Paleocene rotaliid architecture"
          },
          {
            "level": "D",
            "text": "thickened central region"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Miscellanea",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 8,
        "mandatoryTotal": 2,
        "mandatoryMatched": 1,
        "mandatoryViolated": [],
        "diagnosticMatched": [
          "large robust lenticular morphology"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "D",
            "text": "large robust lenticular morphology",
            "detail": "CHR_02=LENTICULAR"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "complex larger rotaliid architecture"
          },
          {
            "level": "D",
            "text": "highly developed internal differentiation"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Rotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 2,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "relatively simple biconvex rotaliid morphology"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Pararotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 2,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "more angular/peripherally differentiated test than typical Rotalia"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Cuvillierina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Paleocene rotaliid architecture"
          },
          {
            "level": "D",
            "text": "characteristic peripheral/internal differentiation"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Ornatorotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 2,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "conspicuous radial/ornamental surface pattern"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Granorotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 2,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "granular/coarsely ornamented surface"
          },
          {
            "level": "D",
            "text": "lacks characteristic Ornatorotalia radial ornament"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      }
    ],
    "excluded": [
      {
        "genus": "Nummulites",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 7,
        "mandatoryTotal": 5,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]",
          "nummulitid-type marginal structure [CHR_17=PRESENT]",
          "secondary chamberlets absent [CHR_11=ABSENT]"
        ],
        "diagnosticMatched": [
          "generally involute"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "lenticular/discoidal test"
        ],
        "contradictions": [
          "trochospiral architecture [CHR_06=TROCHOSPIRAL]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline/perforate test",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "D",
            "text": "generally involute",
            "detail": "CHR_08=INVOLUTE"
          },
          {
            "level": "S",
            "text": "lenticular/discoidal test",
            "detail": "CHR_02=LENTICULAR"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "characteristic septal filaments"
          },
          {
            "level": "S",
            "text": "bilateral symmetry"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Assilina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]",
          "nummulitid marginal architecture [CHR_17=PRESENT]",
          "secondary chamberlets absent [CHR_11=ABSENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "strongly involute thick Nummulites morphology [CHR_08=INVOLUTE]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "earlier whorls clearly exposed"
          },
          {
            "level": "D",
            "text": "relatively flatter test"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Operculina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "strongly involute test [CHR_08=INVOLUTE]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "nummulitid/operculinid marginal architecture"
          },
          {
            "level": "D",
            "text": "loose/open coiling"
          },
          {
            "level": "D",
            "text": "rapid whorl expansion"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Ranikothalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 13,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [
          "robust lenticular test",
          "tight/involute coiling"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "D",
            "text": "robust lenticular test",
            "detail": "CHR_02=LENTICULAR"
          },
          {
            "level": "D",
            "text": "tight/involute coiling",
            "detail": "CHR_08=INVOLUTE"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Paleogene larger nummulitid architecture"
          },
          {
            "level": "S",
            "text": "Paleocene age"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Heterostegina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 8,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [
          "equatorial chamberlets present"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "D",
            "text": "equatorial chamberlets present",
            "detail": "CHR_11=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "secondary subdivision of equatorial chambers"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Spiroclypeus",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 8,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [
          "lateral chamberlets present"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "D",
            "text": "lateral chamberlets present",
            "detail": "CHR_11=PRESENT, CHR_15=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "secondary equatorial chamberlets"
          },
          {
            "level": "D",
            "text": "complex multilayered architecture"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Asterocyclina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]",
          "annular equatorial growth [CHR_05=ANNULAR]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "lateral chambers"
          },
          {
            "level": "D",
            "text": "strong radial rays"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: discoidal [CHR_02=DISCOIDAL]"
      },
      {
        "genus": "Discocyclina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 5,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]",
          "annular equatorial layer [CHR_05=ANNULAR]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "equatorial chamberlets"
          },
          {
            "level": "M",
            "text": "lateral chambers"
          },
          {
            "level": "D",
            "text": "Discocyclina-type equatorial chamberlets"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: discoidal [CHR_02=DISCOIDAL]"
      },
      {
        "genus": "Orbitoclypeus",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]",
          "annular equatorial growth [CHR_05=ANNULAR]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "lateral chambers"
          },
          {
            "level": "D",
            "text": "annular stolons absent"
          },
          {
            "level": "D",
            "text": "Orbitoclypeus-type equatorial chamberlets"
          },
          {
            "level": "D",
            "text": "characteristic embryonic apparatus"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: discoidal [CHR_02=DISCOIDAL]"
      },
      {
        "genus": "Nemkovella",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]",
          "annular growth [CHR_05=ANNULAR]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "annular stolons absent"
          },
          {
            "level": "D",
            "text": "Nemkovella-type equatorial chamberlets"
          },
          {
            "level": "D",
            "text": "characteristic embryonic apparatus"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: discoidal [CHR_02=DISCOIDAL]"
      },
      {
        "genus": "Lenticulina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 11,
        "mandatoryTotal": 4,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [
          "no nummulitid marginal cord"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "hyaline",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "lenticular",
            "detail": "CHR_02=LENTICULAR"
          },
          {
            "level": "D",
            "text": "no nummulitid marginal cord",
            "detail": "CHR_17=ABSENT"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "simple chambers"
          },
          {
            "level": "D",
            "text": "no developed nummulitid canal system"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Palaeonummulites",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 6,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Nummulitid-type marginal structure present [CHR_17=PRESENT]"
        ],
        "diagnosticMatched": [
          "Primary septa and septal filaments present"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "Secondary equatorial chamberlets present [CHR_11=PRESENT]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Hyaline / finely perforate calcitic test",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Involute coiling",
            "detail": "CHR_08=INVOLUTE"
          },
          {
            "level": "D",
            "text": "Primary septa and septal filaments present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Spire tightly to moderately tightly coiled"
          },
          {
            "level": "D",
            "text": "Relatively few whorls; generally no more than 4--5 in the A-form"
          },
          {
            "level": "D",
            "text": "Chambers may reach approximately twice their length in height in equatorial section"
          },
          {
            "level": "S",
            "text": "Comparatively simple early nummulitid internal architecture"
          },
          {
            "level": "S",
            "text": "Late Paleocene--Eocene occurrence compatible with genus"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Nummulitoides",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -3,
        "mandatoryTotal": 6,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Large compressed/discoidal nummulitid test [CHR_02=DISCOIDAL]",
          "Thick marginal cord present [CHR_17=PRESENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Wall relatively thick and finely perforate"
        ],
        "contradictions": [
          "Fully involute architecture throughout [CHR_08=INVOLUTE]",
          "Strong secondary chamberlet system [CHR_11=PRESENT]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Hyaline / finely perforate calcitic test",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "S",
            "text": "Wall relatively thick and finely perforate",
            "detail": "CHR_01=HYALINE"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Spire moderate to lax"
          },
          {
            "level": "D",
            "text": "Ramifying marginal canals present"
          },
          {
            "level": "S",
            "text": "B-form may reach approximately 1 cm diameter"
          },
          {
            "level": "S",
            "text": "Late Paleocene--Early Eocene range compatible"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Planocamerinoides",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -3,
        "mandatoryTotal": 6,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Compressed test [CHR_02=FLATTENED]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Nummulitid marginal structure present [CHR_17=PRESENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Test commonly lenticular/compressed"
        ],
        "contradictions": [
          "Strongly involute architecture [CHR_08=INVOLUTE]",
          "Secondary chamberlets present [CHR_11=PRESENT]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Hyaline / perforate calcitic test",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "S",
            "text": "Test commonly lenticular/compressed",
            "detail": "CHR_02=LENTICULAR"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Spire tightly and uniformly coiled"
          },
          {
            "level": "D",
            "text": "Very low opening rate; less than approximately 1.5× between successive whorls"
          },
          {
            "level": "D",
            "text": "Whorls comparatively numerous"
          },
          {
            "level": "D",
            "text": "Chambers regular and higher than long"
          },
          {
            "level": "S",
            "text": "Inflated polar region may be present"
          },
          {
            "level": "S",
            "text": "Central depression may be marked"
          },
          {
            "level": "S",
            "text": "Late Paleocene--Middle Eocene range compatible"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Chordoperculinoides",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 6,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Massive marginal cord present [CHR_17=STRONG]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Hyaline / finely perforate calcitic test",
            "detail": "CHR_01=HYALINE"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Involute",
            "detail": "CHR_08=INVOLUTE"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Thick, coarse vertical canals"
          },
          {
            "level": "D",
            "text": "Ramifying marginal canals"
          },
          {
            "level": "D",
            "text": "Strong septal canals connected to the marginal canal system"
          },
          {
            "level": "D",
            "text": "Moderately tight coiling"
          },
          {
            "level": "D",
            "text": "Chambers become distinctly higher than long"
          },
          {
            "level": "S",
            "text": "Large test; B-form may exceed 1 cm"
          },
          {
            "level": "S",
            "text": "Fine perforation of wall"
          },
          {
            "level": "S",
            "text": "Strong peripheral canal development"
          },
          {
            "level": "S",
            "text": "Late Paleocene occurrence strongly compatible"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Planispiral [CHR_06=PLANISPIRAL]"
      }
    ]
  }
}