{
  "imageId": "IMG_148",
  "imageSha256": "0124f58ef2d7e348689cf87874373654ae1eff2887fb608c986ed6cbc207666c",
  "configHash": "b8e8953fc0ead02af988f5e02aa1ead1c488ec3445cc5cb7f8c83f26134fe534",
  "success": true,
  "elapsedMs": 14082,
  "attempts": [
    {
      "attempt": 1,
      "at": "2026-11-09T09:30:23.807Z",
      "httpStatus": 200,
      "imageSha256": "0124f58ef2d7e348689cf87874373654ae1eff2887fb608c986ed6cbc207666c",
      "request": {
        "model": "gemini-3.5-flash-lite",
        "generationConfig": {
          "temperature": 0.2,
          "responseMimeType": "application/json"
        },
        "text": "You are the vision observer for GeoKnow / ESOGU \"foraminifera-fossil\".\nYou are NOT a taxonomic authority and you do NOT replace the project's scoring engine.\n\nGoal: look at the attached optical image(s) of a microfossil (thin section or reflected-light photomicrograph) and fill the project's character sheet CHR_01–CHR_21.\n\nHard rules\n1. Observe first. Identify only as a tentative suggestion.\n2. Never invent a character. If it is not clearly visible, use state NOT_OBSERVABLE. If visible but ambiguous, use UNCERTAIN.\n3. NOT_OBSERVABLE is not ABSENT. Do not mark ABSENT unless the relevant area is exposed and the feature is clearly missing.\n4. Keep CHR_05 and CHR_06 separate:\n   - CHR_05 = serial arrangement only (UNISERIAL, BISERIAL, TRISERIAL, QUINQUELOCULINE, TRILOCULINE, BILOCULINE, ANNULAR, CYCLIC, IRREGULAR_SERIAL, OTHER)\n   - CHR_06 = coiling (PLANISPIRAL, TROCHOSPIRAL, STREPTOSPIRAL, GLOMOSPIRAL, IRREGULAR_COILING, UNCOILED)\n5. Do not force a species name. Prefer genus or morphogroup. If evidence is weak, identification_status = INDETERMINATE.\n6. This tool is academic and non-commercial. Do not present the answer as an official Foraminifera.eu, WoRMS, or museum determination.\n7. Reply with VALID JSON only. No markdown, no preamble, no trailing text.\n8. Allowed observation states: PRESENT, ABSENT, NOT_OBSERVABLE, UNCERTAIN.\n9. Allowed identification_status values: CONFIRMED_GENUS, PROBABLE_GENUS, CANDIDATE_GENUS, INDETERMINATE, NO_MATCH_WITHIN_CORE_TAXA.\n10. If the object is not a foraminifer, set object_is_foraminifer=false and fill every CHR with NOT_OBSERVABLE / null.\n\nAllowed values (use ONLY these codes)\n\nCHR_01 Test composition: AGGLUTINATED | PORCELANEOUS | HYALINE | UNCERTAIN\nCHR_02 Test shape: GLOBULAR | SAC_LIKE | TUBULAR | ELONGATE | FUSIFORM | OVOID | LENTICULAR | DISCOIDAL | FLATTENED | CONICAL | HIGH_CONICAL | FLABELLIFORM | STELLATE | IRREGULAR | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_03 Septation: PRESENT | ABSENT | NOT_OBSERVABLE | UNCERTAIN\nCHR_04 Chamber number organization: UNDIVIDED | MULTICHAMBERED | NOT_OBSERVABLE | UNCERTAIN\nCHR_05 Chamber arrangement: UNISERIAL | BISERIAL | TRISERIAL | QUINQUELOCULINE | TRILOCULINE | BILOCULINE | ANNULAR | CYCLIC | IRREGULAR_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_06 Coiling pattern: PLANISPIRAL | TROCHOSPIRAL | STREPTOSPIRAL | GLOMOSPIRAL | IRREGULAR_COILING | UNCOILED | NOT_OBSERVABLE | UNCERTAIN\nCHR_07 Coiling plane: SINGLE_PLANE | CHANGING_PLANES | MULTIDIRECTIONAL | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_08 Involution/evolution: INVOLUTE | SEMI_INVOLUTE | EVOLUTE | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_09 Ontogenetic arrangement change: NONE | PLANISPIRAL_TO_UNISERIAL | PLANISPIRAL_TO_BISERIAL | BISERIAL_TO_UNISERIAL | TRISERIAL_TO_BISERIAL | TRISERIAL_TO_UNISERIAL | COILED_TO_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_10 Internal complexity: SIMPLE | SUBDIVIDED | COMPLEX | RETICULATE | LABYRINTHIC | NOT_OBSERVABLE | UNCERTAIN\nCHR_11 Secondary chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_12 Embryonic apparatus: SIMPLE | BILOCULAR | MULTILOCULAR | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_13 Radial/internal partitions: ABSENT | RADIAL | VERTICAL | SUBEPIDERMAL | RETICULATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_14 Pillars: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_15 Lateral chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_16 Aperture type: TERMINAL | INTERIOMARGINAL | BASAL | MULTIPLE | SLIT_LIKE | CRIBRATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_17 Marginal cord: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_18 Septal filaments: ABSENT | SIMPLE | CURVED | WAVY | RETICULATE | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_19 Attachment mode: FREE | ATTACHED | NOT_OBSERVABLE | UNCERTAIN\nCHR_20 Dimorphism: PRESENT | ABSENT | MEGALOSPHERIC_FORM | MICROSPHERIC_FORM | NOT_OBSERVABLE | UNCERTAIN\nCHR_21 Section orientation: AXIAL | EQUATORIAL | OBLIQUE | TANGENTIAL | UNKNOWN\n\nObservation object format for every CHR:\n{\"value\": \"<CODE or null>\", \"state\": \"PRESENT|ABSENT|NOT_OBSERVABLE|UNCERTAIN\", \"reason\": \"one short sentence\"}\n\nWhen state is NOT_OBSERVABLE or UNCERTAIN, value may be null.\nFor CHR_01, if composition cannot be judged from lighting, value=UNCERTAIN and state=UNCERTAIN.\nFor CHR_21, state is usually PRESENT and value is the section type; use UNKNOWN if the view is external, not a thin section.\n\nContext from the user:\n- locality: unknown\n- age / stratigraphy: unknown\n- lighting / magnification: unknown\n- scale: unknown\n- views provided: unknown\n\nReturn exactly this JSON schema:\n\n{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"good|fair|poor\",\n  \"image_type\": \"thin_section|reflected_light|sem|mixed|unknown\",\n  \"observations\": {\n    \"CHR_01\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_02\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_03\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_04\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_05\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_06\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_07\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_08\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_09\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_10\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_11\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_12\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_13\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_14\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_15\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_16\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_17\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_18\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_19\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_20\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_21\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"}\n  },\n  \"module\": \"AGGLUTINATED|PORCELANEOUS|HYALINE|UNKNOWN\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"INDETERMINATE\",\n    \"best_open_id\": \"\",\n    \"candidate_genera\": [{\"name\": \"\", \"confidence\": \"low|moderate|high\", \"why\": \"\"}],\n    \"lookalikes\": [],\n    \"why_not_species_level\": \"\"\n  },\n  \"student_explanation_en\": \"Max 120 words, simple English.\",\n  \"student_explanation_tr\": \"En fazla 120 kelime, sade Türkçe.\",\n  \"expert_checklist_tr\": [\"uzmanın kontrol edeceği 3-5 nokta\"],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
        "imageSha256": "0124f58ef2d7e348689cf87874373654ae1eff2887fb608c986ed6cbc207666c",
        "mimeType": "image/png"
      },
      "providerStatus": 200,
      "providerResponse": {
        "candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"fair\",\n  \"image_type\": \"thin_section\",\n  \"observations\": {\n    \"CHR_01\": {\n      \"value\": \"HYALINE\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Microcrystalline or recrystallized calcareous wall typical of larger benthic foraminifera.\"\n    },\n    \"CHR_02\": {\n      \"value\": \"FLATTENED\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"The test appears broad, low, and flattened in this section.\"\n    },\n    \"CHR_03\": {\n      \"value\": \"PRESENT\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Clear septation dividing the chamber layers.\"\n    },\n    \"CHR_04\": {\n      \"value\": \"MULTICHAMBERED\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Clearly composed of multiple chambers and complex internal layers.\"\n    },\n    \"CHR_05\": {\n      \"value\": \"ANNULAR\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Chambers arranged in expanding concentric or annular layers.\"\n    },\n    \"CHR_06\": {\n      \"value\": \"UNCOILED\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Flaring or uncoiled annular growth stage visible.\"\n    },\n    \"CHR_07\": {\n      \"value\": \"SINGLE_PLANE\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Growth occurs within a planar framework.\"\n    },\n    \"CHR_08\": {\n      \"value\": \"EVOLUTE\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Concentric annular chambers added externally.\"\n    },\n    \"CHR_09\": {\n      \"value\": \"COILED_TO_SERIAL\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Transition from initial coiled stage to uncoiled annular chamber arrangement.\"\n    },\n    \"CHR_10\": {\n      \"value\": \"COMPLEX\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Presence of complex internal structures such as partitions and chamberlets.\"\n    },\n    \"CHR_11\": {\n      \"value\": \"WELL_DEVELOPED\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Secondary chamberlets/subdivision clearly visible in the outer zone.\"\n    },\n    \"CHR_12\": {\n      \"value\": \"NOT_OBSERVABLE\",\n      \"state\": \"NOT_OBSERVABLE\",\n      \"reason\": \"The initial embryonic apparatus is not captured in this section plane.\"\n    },\n    \"CHR_13\": {\n      \"value\": \"RETICULATE\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Interconnected radial and vertical partitions form a reticulate internal network.\"\n    },\n    \"CHR_14\": {\n      \"value\": \"ABSENT\",\n      \"state\": \"ABSENT\",\n      \"reason\": \"No prominent vertical pillars observed in this specific view.\"\n    },\n    \"CHR_15\": {\n      \"value\": \"WELL_DEVELOPED\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Equatorial/lateral chamberlets are well formed.\"\n    },\n    \"CHR_16\": {\n      \"value\": \"MULTIPLE\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Multiple apertures along the periphery are typical for such annular forms.\"\n    },\n    \"CHR_17\": {\n      \"value\": \"ABSENT\",\n      \"state\": \"ABSENT\",\n      \"reason\": \"No distinct marginal cord structure detected.\"\n    },\n    \"CHR_18\": {\n      \"value\": \"ABSENT\",\n      \"state\": \"ABSENT\",\n      \"reason\": \"External surface filaments not visible in thin section.\"\n    },\n    \"CHR_19\": {\n      \"value\": \"FREE\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Test morphology is symmetrical and unattached.\"\n    },\n    \"CHR_20\": {\n      \"value\": \"NOT_OBSERVABLE\",\n      \"state\": \"NOT_OBSERVABLE\",\n      \"reason\": \"Cannot determine generation without seeing the megalospheric/microspheric nucleoconch.\"\n    },\n    \"CHR_21\": {\n      \"value\": \"EQUATORIAL\",\n      \"state\": \"PRESENT\",\n      \"reason\": \"Section passes through the equatorial plane showing chamber arrangement and internal partitions.\"\n    }\n  },\n  \"module\": \"HYALINE\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"CANDIDATE_GENUS\",\n    \"best_open_id\": \"Orbitolitid or Cycloclypeus-like larger benthic foraminifer\",\n    \"candidate_genera\": [\n      {\n        \"name\": \"Orbitolites\",\n        \"confidence\": \"low\",\n        \"why\": \"Shows annular chambers and subdivision typical of complex soritids/orbitolitids.\"\n      },\n      {\n        \"name\": \"Cycloclypeus\",\n        \"confidence\": \"low\",\n        \"why\": \"Annular chamber arrangement with internal partitions resembles nummulitids/cycloclypeids.\"\n      }\n    ],\n    \"lookalikes\": [\n      \"Orbitoides\",\n      \"Amphistegina\"\n    ],\n    \"why_not_species_level\": \"Thin section orientation misses the embryonic apparatus and exact wall microstructure details needed for species determination.\"\n  },\n  \"student_explanation_en\": \"This image shows an equatorial thin section of a complex, larger benthic foraminifer with annular chambers and intricate internal partitions. It displays a reticulate internal network and multiple chamberlets, typical of advanced benthic forms.\",\n  \"student_explanation_tr\": \"Bu görüntü, halkasal odacıklara ve karmaşık iç bölmelere sahip, büyük bentik bir foraminifere ait ekvatoryal kesiti göstermektedir. Gelişmiş bentik formlara özgü retiküler iç ağ yapıları ve çoklu odacıklar net bir şekilde görülmektedir.\",\n  \"expert_checklist_tr\": [\n    \"Ekvatoryal kesit düzleminin doğruluğunu kontrol edin\",\n    \"İç bölmelerin (partition) ağ yapısını inceleyin\",\n    \"Odacık aranjmanının halkasal (annular) geçişini doğrulayın\"\n  ],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
                  "thoughtSignature": "EmAKXgFpFH0TVK1vcpFORKPR1vmAL47Q4wt/5fWTnJ4O3wemBGMLOG7yFmMqbalc+zmPHHihL3B5wrz+9aupWQruwz53YZ9Xwo6W8jMXmSGchxBIGMJ7ND0ZNXl7e/DseRE="
                }
              ],
              "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 3256,
          "candidatesTokenCount": 1507,
          "totalTokenCount": 4763,
          "promptTokensDetails": [
            {
              "modality": "IMAGE",
              "tokenCount": 1073
            },
            {
              "modality": "TEXT",
              "tokenCount": 2183
            }
          ],
          "serviceTier": "standard"
        },
        "modelVersion": "gemini-3.5-flash-lite",
        "responseId": "q5LxasCjM42AkdUP-eWDuQ4"
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
          "reason": "Microcrystalline or recrystallized calcareous wall typical of larger benthic foraminifera."
        },
        "CHR_02": {
          "value": "FLATTENED",
          "state": "PRESENT",
          "reason": "The test appears broad, low, and flattened in this section."
        },
        "CHR_03": {
          "value": "PRESENT",
          "state": "PRESENT",
          "reason": "Clear septation dividing the chamber layers."
        },
        "CHR_04": {
          "value": "MULTICHAMBERED",
          "state": "PRESENT",
          "reason": "Clearly composed of multiple chambers and complex internal layers."
        },
        "CHR_05": {
          "value": "ANNULAR",
          "state": "PRESENT",
          "reason": "Chambers arranged in expanding concentric or annular layers."
        },
        "CHR_06": {
          "value": "UNCOILED",
          "state": "PRESENT",
          "reason": "Flaring or uncoiled annular growth stage visible."
        },
        "CHR_07": {
          "value": "SINGLE_PLANE",
          "state": "PRESENT",
          "reason": "Growth occurs within a planar framework."
        },
        "CHR_08": {
          "value": "EVOLUTE",
          "state": "PRESENT",
          "reason": "Concentric annular chambers added externally."
        },
        "CHR_09": {
          "value": "COILED_TO_SERIAL",
          "state": "PRESENT",
          "reason": "Transition from initial coiled stage to uncoiled annular chamber arrangement."
        },
        "CHR_10": {
          "value": "COMPLEX",
          "state": "PRESENT",
          "reason": "Presence of complex internal structures such as partitions and chamberlets."
        },
        "CHR_11": {
          "value": "WELL_DEVELOPED",
          "state": "PRESENT",
          "reason": "Secondary chamberlets/subdivision clearly visible in the outer zone."
        },
        "CHR_12": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "The initial embryonic apparatus is not captured in this section plane."
        },
        "CHR_13": {
          "value": "RETICULATE",
          "state": "PRESENT",
          "reason": "Interconnected radial and vertical partitions form a reticulate internal network."
        },
        "CHR_14": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "No prominent vertical pillars observed in this specific view."
        },
        "CHR_15": {
          "value": "WELL_DEVELOPED",
          "state": "PRESENT",
          "reason": "Equatorial/lateral chamberlets are well formed."
        },
        "CHR_16": {
          "value": "MULTIPLE",
          "state": "PRESENT",
          "reason": "Multiple apertures along the periphery are typical for such annular forms."
        },
        "CHR_17": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "No distinct marginal cord structure detected."
        },
        "CHR_18": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "External surface filaments not visible in thin section."
        },
        "CHR_19": {
          "value": "FREE",
          "state": "PRESENT",
          "reason": "Test morphology is symmetrical and unattached."
        },
        "CHR_20": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Cannot determine generation without seeing the megalospheric/microspheric nucleoconch."
        },
        "CHR_21": {
          "value": "EQUATORIAL",
          "state": "PRESENT",
          "reason": "Section passes through the equatorial plane showing chamber arrangement and internal partitions."
        }
      },
      "module": "HYALINE",
      "vlm_suggestion": {
        "identification_status": "CANDIDATE_GENUS",
        "best_open_id": "Orbitolitid or Cycloclypeus-like larger benthic foraminifer",
        "candidate_genera": [
          {
            "name": "Orbitolites",
            "confidence": "low",
            "why": "Shows annular chambers and subdivision typical of complex soritids/orbitolitids."
          },
          {
            "name": "Cycloclypeus",
            "confidence": "low",
            "why": "Annular chamber arrangement with internal partitions resembles nummulitids/cycloclypeids."
          }
        ],
        "lookalikes": [
          "Orbitoides",
          "Amphistegina"
        ],
        "why_not_species_level": "Thin section orientation misses the embryonic apparatus and exact wall microstructure details needed for species determination."
      },
      "student_explanation_en": "This image shows an equatorial thin section of a complex, larger benthic foraminifer with annular chambers and intricate internal partitions. It displays a reticulate internal network and multiple chamberlets, typical of advanced benthic forms.",
      "student_explanation_tr": "Bu görüntü, halkasal odacıklara ve karmaşık iç bölmelere sahip, büyük bentik bir foraminifere ait ekvatoryal kesiti göstermektedir. Gelişmiş bentik formlara özgü retiküler iç ağ yapıları ve çoklu odacıklar net bir şekilde görülmektedir.",
      "expert_checklist_tr": [
        "Ekvatoryal kesit düzleminin doğruluğunu kontrol edin",
        "İç bölmelerin (partition) ağ yapısını inceleyin",
        "Odacık aranjmanının halkasal (annular) geçişini doğrulayın"
      ],
      "disclaimer_tr": "Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir."
    },
    "score": null
  },
  "score": {
    "module": "HYALINE",
    "status": "INDETERMINATE",
    "identification": null,
    "confidenceNote": "INSUFFICIENT_OBSERVATIONS_LEAD",
    "ranking": [
      {
        "genus": "Miscellanea",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 2,
        "mandatoryMatched": 1,
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
      }
    ],
    "excluded": [
      {
        "genus": "Nummulites",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 1,
        "mandatoryTotal": 5,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]",
          "nummulitid-type marginal structure [CHR_17=PRESENT]",
          "secondary chamberlets absent [CHR_11=ABSENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "annular orthophragminid growth [CHR_05=ANNULAR]"
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
        "score": 8,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]",
          "nummulitid marginal architecture [CHR_17=PRESENT]",
          "secondary chamberlets absent [CHR_11=ABSENT]"
        ],
        "diagnosticMatched": [
          "more evolute than typical Nummulites"
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
            "text": "more evolute than typical Nummulites",
            "detail": "CHR_08=EVOLUTE"
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
        "score": 8,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [
          "strongly evolute"
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
            "text": "strongly evolute",
            "detail": "CHR_08=EVOLUTE"
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
          "strongly evolute thin morphology [CHR_08=EVOLUTE]"
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
        "genus": "Lockhartia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "strong dorsal/ventral asymmetry"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Kathina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "larger rotaliid architecture"
          },
          {
            "level": "D",
            "text": "strong central/umbilical thickening"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Daviesina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 11,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "rotaliid/trochospiral architecture [CHR_06=TROCHOSPIRAL]"
        ],
        "diagnosticMatched": [
          "relatively flattened test"
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
            "level": "D",
            "text": "relatively flattened test",
            "detail": "CHR_02=FLATTENED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "differentiated peripheral internal zone"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: rotaliid/trochospiral architecture [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Laffitteina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Rotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 2,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "relatively simple biconvex rotaliid morphology"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Pararotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 2,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "more angular/peripherally differentiated test than typical Rotalia"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Cuvillierina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "Paleocene rotaliid architecture"
          },
          {
            "level": "D",
            "text": "characteristic peripheral/internal differentiation"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Ornatorotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 2,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "conspicuous radial/ornamental surface pattern"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Granorotalia",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 2,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "trochospiral [CHR_06=TROCHOSPIRAL]"
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
            "text": "granular/coarsely ornamented surface"
          },
          {
            "level": "D",
            "text": "lacks characteristic Ornatorotalia radial ornament"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: trochospiral [CHR_06=TROCHOSPIRAL]"
      },
      {
        "genus": "Asterocyclina",
        "module": "HYALINE",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 4,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]"
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
          },
          {
            "level": "M",
            "text": "annular equatorial growth",
            "detail": "CHR_05=ANNULAR"
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
        "score": 11,
        "mandatoryTotal": 5,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]"
        ],
        "diagnosticMatched": [
          "annular stolons present"
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
            "text": "annular equatorial layer",
            "detail": "CHR_05=ANNULAR"
          },
          {
            "level": "D",
            "text": "annular stolons present",
            "detail": "CHR_05=ANNULAR"
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
        "score": 6,
        "mandatoryTotal": 4,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]"
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
          },
          {
            "level": "M",
            "text": "annular equatorial growth",
            "detail": "CHR_05=ANNULAR"
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
        "score": 6,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "discoidal [CHR_02=DISCOIDAL]"
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
          },
          {
            "level": "M",
            "text": "annular growth",
            "detail": "CHR_05=ANNULAR"
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
        "score": 8,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "planispiral [CHR_06=PLANISPIRAL]",
          "lenticular [CHR_02=LENTICULAR]"
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
        "score": 1,
        "mandatoryTotal": 6,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Involute coiling [CHR_08=INVOLUTE]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Nummulitid-type marginal structure present [CHR_17=PRESENT]"
        ],
        "diagnosticMatched": [
          "Primary septa and septal filaments present"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "Strongly evolute, loosely coiled Operculina-type morphology [CHR_08=EVOLUTE]",
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
          "Completely evolute adult whorls with no clasping of the previous marginal cord [CHR_08=EVOLUTE]",
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
        "score": 4,
        "mandatoryTotal": 6,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Nummulitid marginal structure present [CHR_17=PRESENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
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
            "level": "M",
            "text": "Compressed test",
            "detail": "CHR_02=FLATTENED"
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
        "score": 2,
        "mandatoryTotal": 6,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]",
          "Involute [CHR_08=INVOLUTE]",
          "Secondary chamberlets absent [CHR_11=ABSENT]",
          "Massive marginal cord present [CHR_17=STRONG]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Semi-compressed morphology"
        ],
        "contradictions": [
          "Evolute Operculina/Assilina-type architecture [CHR_08=EVOLUTE]"
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
            "text": "Semi-compressed morphology",
            "detail": "CHR_02=FLATTENED"
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