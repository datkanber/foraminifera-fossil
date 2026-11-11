{
  "imageId": "IMG_147",
  "imageSha256": "87b875b612d4cac9444a0d1690b6473628c3f50c00b8f4b2e84a39603de35fdc",
  "configHash": "b8e8953fc0ead02af988f5e02aa1ead1c488ec3445cc5cb7f8c83f26134fe534",
  "success": true,
  "elapsedMs": 31189,
  "attempts": [
    {
      "attempt": 1,
      "at": "2026-11-09T09:30:12.149Z",
      "httpStatus": 502,
      "imageSha256": "87b875b612d4cac9444a0d1690b6473628c3f50c00b8f4b2e84a39603de35fdc",
      "request": {
        "model": "gemini-3.5-flash-lite",
        "generationConfig": {
          "temperature": 0.2,
          "responseMimeType": "application/json"
        },
        "text": "You are the vision observer for GeoKnow / ESOGU \"foraminifera-fossil\".\nYou are NOT a taxonomic authority and you do NOT replace the project's scoring engine.\n\nGoal: look at the attached optical image(s) of a microfossil (thin section or reflected-light photomicrograph) and fill the project's character sheet CHR_01–CHR_21.\n\nHard rules\n1. Observe first. Identify only as a tentative suggestion.\n2. Never invent a character. If it is not clearly visible, use state NOT_OBSERVABLE. If visible but ambiguous, use UNCERTAIN.\n3. NOT_OBSERVABLE is not ABSENT. Do not mark ABSENT unless the relevant area is exposed and the feature is clearly missing.\n4. Keep CHR_05 and CHR_06 separate:\n   - CHR_05 = serial arrangement only (UNISERIAL, BISERIAL, TRISERIAL, QUINQUELOCULINE, TRILOCULINE, BILOCULINE, ANNULAR, CYCLIC, IRREGULAR_SERIAL, OTHER)\n   - CHR_06 = coiling (PLANISPIRAL, TROCHOSPIRAL, STREPTOSPIRAL, GLOMOSPIRAL, IRREGULAR_COILING, UNCOILED)\n5. Do not force a species name. Prefer genus or morphogroup. If evidence is weak, identification_status = INDETERMINATE.\n6. This tool is academic and non-commercial. Do not present the answer as an official Foraminifera.eu, WoRMS, or museum determination.\n7. Reply with VALID JSON only. No markdown, no preamble, no trailing text.\n8. Allowed observation states: PRESENT, ABSENT, NOT_OBSERVABLE, UNCERTAIN.\n9. Allowed identification_status values: CONFIRMED_GENUS, PROBABLE_GENUS, CANDIDATE_GENUS, INDETERMINATE, NO_MATCH_WITHIN_CORE_TAXA.\n10. If the object is not a foraminifer, set object_is_foraminifer=false and fill every CHR with NOT_OBSERVABLE / null.\n\nAllowed values (use ONLY these codes)\n\nCHR_01 Test composition: AGGLUTINATED | PORCELANEOUS | HYALINE | UNCERTAIN\nCHR_02 Test shape: GLOBULAR | SAC_LIKE | TUBULAR | ELONGATE | FUSIFORM | OVOID | LENTICULAR | DISCOIDAL | FLATTENED | CONICAL | HIGH_CONICAL | FLABELLIFORM | STELLATE | IRREGULAR | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_03 Septation: PRESENT | ABSENT | NOT_OBSERVABLE | UNCERTAIN\nCHR_04 Chamber number organization: UNDIVIDED | MULTICHAMBERED | NOT_OBSERVABLE | UNCERTAIN\nCHR_05 Chamber arrangement: UNISERIAL | BISERIAL | TRISERIAL | QUINQUELOCULINE | TRILOCULINE | BILOCULINE | ANNULAR | CYCLIC | IRREGULAR_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_06 Coiling pattern: PLANISPIRAL | TROCHOSPIRAL | STREPTOSPIRAL | GLOMOSPIRAL | IRREGULAR_COILING | UNCOILED | NOT_OBSERVABLE | UNCERTAIN\nCHR_07 Coiling plane: SINGLE_PLANE | CHANGING_PLANES | MULTIDIRECTIONAL | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_08 Involution/evolution: INVOLUTE | SEMI_INVOLUTE | EVOLUTE | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_09 Ontogenetic arrangement change: NONE | PLANISPIRAL_TO_UNISERIAL | PLANISPIRAL_TO_BISERIAL | BISERIAL_TO_UNISERIAL | TRISERIAL_TO_BISERIAL | TRISERIAL_TO_UNISERIAL | COILED_TO_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_10 Internal complexity: SIMPLE | SUBDIVIDED | COMPLEX | RETICULATE | LABYRINTHIC | NOT_OBSERVABLE | UNCERTAIN\nCHR_11 Secondary chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_12 Embryonic apparatus: SIMPLE | BILOCULAR | MULTILOCULAR | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_13 Radial/internal partitions: ABSENT | RADIAL | VERTICAL | SUBEPIDERMAL | RETICULATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_14 Pillars: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_15 Lateral chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_16 Aperture type: TERMINAL | INTERIOMARGINAL | BASAL | MULTIPLE | SLIT_LIKE | CRIBRATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_17 Marginal cord: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_18 Septal filaments: ABSENT | SIMPLE | CURVED | WAVY | RETICULATE | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_19 Attachment mode: FREE | ATTACHED | NOT_OBSERVABLE | UNCERTAIN\nCHR_20 Dimorphism: PRESENT | ABSENT | MEGALOSPHERIC_FORM | MICROSPHERIC_FORM | NOT_OBSERVABLE | UNCERTAIN\nCHR_21 Section orientation: AXIAL | EQUATORIAL | OBLIQUE | TANGENTIAL | UNKNOWN\n\nObservation object format for every CHR:\n{\"value\": \"<CODE or null>\", \"state\": \"PRESENT|ABSENT|NOT_OBSERVABLE|UNCERTAIN\", \"reason\": \"one short sentence\"}\n\nWhen state is NOT_OBSERVABLE or UNCERTAIN, value may be null.\nFor CHR_01, if composition cannot be judged from lighting, value=UNCERTAIN and state=UNCERTAIN.\nFor CHR_21, state is usually PRESENT and value is the section type; use UNKNOWN if the view is external, not a thin section.\n\nContext from the user:\n- locality: unknown\n- age / stratigraphy: unknown\n- lighting / magnification: unknown\n- scale: unknown\n- views provided: unknown\n\nReturn exactly this JSON schema:\n\n{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"good|fair|poor\",\n  \"image_type\": \"thin_section|reflected_light|sem|mixed|unknown\",\n  \"observations\": {\n    \"CHR_01\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_02\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_03\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_04\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_05\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_06\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_07\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_08\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_09\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_10\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_11\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_12\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_13\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_14\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_15\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_16\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_17\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_18\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_19\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_20\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_21\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"}\n  },\n  \"module\": \"AGGLUTINATED|PORCELANEOUS|HYALINE|UNKNOWN\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"INDETERMINATE\",\n    \"best_open_id\": \"\",\n    \"candidate_genera\": [{\"name\": \"\", \"confidence\": \"low|moderate|high\", \"why\": \"\"}],\n    \"lookalikes\": [],\n    \"why_not_species_level\": \"\"\n  },\n  \"student_explanation_en\": \"Max 120 words, simple English.\",\n  \"student_explanation_tr\": \"En fazla 120 kelime, sade Türkçe.\",\n  \"expert_checklist_tr\": [\"uzmanın kontrol edeceği 3-5 nokta\"],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
        "imageSha256": "87b875b612d4cac9444a0d1690b6473628c3f50c00b8f4b2e84a39603de35fdc",
        "mimeType": "image/png"
      },
      "providerStatus": 503,
      "providerResponse": {
        "error": {
          "code": 503,
          "message": "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
          "status": "UNAVAILABLE"
        }
      },
      "retryAfter": null
    },
    {
      "attempt": 2,
      "at": "2026-11-09T09:30:36.920Z",
      "httpStatus": 200,
      "imageSha256": "87b875b612d4cac9444a0d1690b6473628c3f50c00b8f4b2e84a39603de35fdc",
      "request": {
        "model": "gemini-3.5-flash-lite",
        "generationConfig": {
          "temperature": 0.2,
          "responseMimeType": "application/json"
        },
        "text": "You are the vision observer for GeoKnow / ESOGU \"foraminifera-fossil\".\nYou are NOT a taxonomic authority and you do NOT replace the project's scoring engine.\n\nGoal: look at the attached optical image(s) of a microfossil (thin section or reflected-light photomicrograph) and fill the project's character sheet CHR_01–CHR_21.\n\nHard rules\n1. Observe first. Identify only as a tentative suggestion.\n2. Never invent a character. If it is not clearly visible, use state NOT_OBSERVABLE. If visible but ambiguous, use UNCERTAIN.\n3. NOT_OBSERVABLE is not ABSENT. Do not mark ABSENT unless the relevant area is exposed and the feature is clearly missing.\n4. Keep CHR_05 and CHR_06 separate:\n   - CHR_05 = serial arrangement only (UNISERIAL, BISERIAL, TRISERIAL, QUINQUELOCULINE, TRILOCULINE, BILOCULINE, ANNULAR, CYCLIC, IRREGULAR_SERIAL, OTHER)\n   - CHR_06 = coiling (PLANISPIRAL, TROCHOSPIRAL, STREPTOSPIRAL, GLOMOSPIRAL, IRREGULAR_COILING, UNCOILED)\n5. Do not force a species name. Prefer genus or morphogroup. If evidence is weak, identification_status = INDETERMINATE.\n6. This tool is academic and non-commercial. Do not present the answer as an official Foraminifera.eu, WoRMS, or museum determination.\n7. Reply with VALID JSON only. No markdown, no preamble, no trailing text.\n8. Allowed observation states: PRESENT, ABSENT, NOT_OBSERVABLE, UNCERTAIN.\n9. Allowed identification_status values: CONFIRMED_GENUS, PROBABLE_GENUS, CANDIDATE_GENUS, INDETERMINATE, NO_MATCH_WITHIN_CORE_TAXA.\n10. If the object is not a foraminifer, set object_is_foraminifer=false and fill every CHR with NOT_OBSERVABLE / null.\n\nAllowed values (use ONLY these codes)\n\nCHR_01 Test composition: AGGLUTINATED | PORCELANEOUS | HYALINE | UNCERTAIN\nCHR_02 Test shape: GLOBULAR | SAC_LIKE | TUBULAR | ELONGATE | FUSIFORM | OVOID | LENTICULAR | DISCOIDAL | FLATTENED | CONICAL | HIGH_CONICAL | FLABELLIFORM | STELLATE | IRREGULAR | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_03 Septation: PRESENT | ABSENT | NOT_OBSERVABLE | UNCERTAIN\nCHR_04 Chamber number organization: UNDIVIDED | MULTICHAMBERED | NOT_OBSERVABLE | UNCERTAIN\nCHR_05 Chamber arrangement: UNISERIAL | BISERIAL | TRISERIAL | QUINQUELOCULINE | TRILOCULINE | BILOCULINE | ANNULAR | CYCLIC | IRREGULAR_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_06 Coiling pattern: PLANISPIRAL | TROCHOSPIRAL | STREPTOSPIRAL | GLOMOSPIRAL | IRREGULAR_COILING | UNCOILED | NOT_OBSERVABLE | UNCERTAIN\nCHR_07 Coiling plane: SINGLE_PLANE | CHANGING_PLANES | MULTIDIRECTIONAL | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_08 Involution/evolution: INVOLUTE | SEMI_INVOLUTE | EVOLUTE | NOT_APPLICABLE | NOT_OBSERVABLE | UNCERTAIN\nCHR_09 Ontogenetic arrangement change: NONE | PLANISPIRAL_TO_UNISERIAL | PLANISPIRAL_TO_BISERIAL | BISERIAL_TO_UNISERIAL | TRISERIAL_TO_BISERIAL | TRISERIAL_TO_UNISERIAL | COILED_TO_SERIAL | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_10 Internal complexity: SIMPLE | SUBDIVIDED | COMPLEX | RETICULATE | LABYRINTHIC | NOT_OBSERVABLE | UNCERTAIN\nCHR_11 Secondary chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_12 Embryonic apparatus: SIMPLE | BILOCULAR | MULTILOCULAR | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_13 Radial/internal partitions: ABSENT | RADIAL | VERTICAL | SUBEPIDERMAL | RETICULATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_14 Pillars: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_15 Lateral chamberlets: PRESENT | ABSENT | WEAKLY_DEVELOPED | WELL_DEVELOPED | NOT_OBSERVABLE | UNCERTAIN\nCHR_16 Aperture type: TERMINAL | INTERIOMARGINAL | BASAL | MULTIPLE | SLIT_LIKE | CRIBRATE | OTHER | NOT_OBSERVABLE | UNCERTAIN\nCHR_17 Marginal cord: PRESENT | ABSENT | WEAK | STRONG | NOT_OBSERVABLE | UNCERTAIN\nCHR_18 Septal filaments: ABSENT | SIMPLE | CURVED | WAVY | RETICULATE | COMPLEX | NOT_OBSERVABLE | UNCERTAIN\nCHR_19 Attachment mode: FREE | ATTACHED | NOT_OBSERVABLE | UNCERTAIN\nCHR_20 Dimorphism: PRESENT | ABSENT | MEGALOSPHERIC_FORM | MICROSPHERIC_FORM | NOT_OBSERVABLE | UNCERTAIN\nCHR_21 Section orientation: AXIAL | EQUATORIAL | OBLIQUE | TANGENTIAL | UNKNOWN\n\nObservation object format for every CHR:\n{\"value\": \"<CODE or null>\", \"state\": \"PRESENT|ABSENT|NOT_OBSERVABLE|UNCERTAIN\", \"reason\": \"one short sentence\"}\n\nWhen state is NOT_OBSERVABLE or UNCERTAIN, value may be null.\nFor CHR_01, if composition cannot be judged from lighting, value=UNCERTAIN and state=UNCERTAIN.\nFor CHR_21, state is usually PRESENT and value is the section type; use UNKNOWN if the view is external, not a thin section.\n\nContext from the user:\n- locality: unknown\n- age / stratigraphy: unknown\n- lighting / magnification: unknown\n- scale: unknown\n- views provided: unknown\n\nReturn exactly this JSON schema:\n\n{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"good|fair|poor\",\n  \"image_type\": \"thin_section|reflected_light|sem|mixed|unknown\",\n  \"observations\": {\n    \"CHR_01\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_02\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_03\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_04\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_05\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_06\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_07\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_08\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_09\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_10\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_11\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_12\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_13\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_14\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_15\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_16\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_17\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_18\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_19\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_20\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"},\n    \"CHR_21\": {\"value\": \"\", \"state\": \"\", \"reason\": \"\"}\n  },\n  \"module\": \"AGGLUTINATED|PORCELANEOUS|HYALINE|UNKNOWN\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"INDETERMINATE\",\n    \"best_open_id\": \"\",\n    \"candidate_genera\": [{\"name\": \"\", \"confidence\": \"low|moderate|high\", \"why\": \"\"}],\n    \"lookalikes\": [],\n    \"why_not_species_level\": \"\"\n  },\n  \"student_explanation_en\": \"Max 120 words, simple English.\",\n  \"student_explanation_tr\": \"En fazla 120 kelime, sade Türkçe.\",\n  \"expert_checklist_tr\": [\"uzmanın kontrol edeceği 3-5 nokta\"],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
        "imageSha256": "87b875b612d4cac9444a0d1690b6473628c3f50c00b8f4b2e84a39603de35fdc",
        "mimeType": "image/png"
      },
      "providerStatus": 200,
      "providerResponse": {
        "candidates": [
          {
            "content": {
              "parts": [
                {
                  "text": "{\n  \"object_is_foraminifer\": true,\n  \"image_quality\": \"fair\",\n  \"image_type\": \"thin_section\",\n  \"observations\": {\n    \"CHR_01\": {\"value\": \"AGGLUTINATED\", \"state\": \"PRESENT\", \"reason\": \"The wall appears thick and granular with agglutinated particles.\"},\n    \"CHR_02\": {\"value\": \"LENTICULAR\", \"state\": \"PRESENT\", \"reason\": \"The overall shape in section is compressed or lens-like.\"},\n    \"CHR_03\": {\"value\": \"PRESENT\", \"state\": \"PRESENT\", \"reason\": \"Clear septa divide the chambers.\"},\n    \"CHR_04\": {\"value\": \"MULTICHAMBERED\", \"state\": \"PRESENT\", \"reason\": \"Multiple chambers are clearly visible in the section.\"},\n    \"CHR_05\": {\"value\": \"OTHER\", \"state\": \"PRESENT\", \"reason\": \"Chambers follow a coiled arrangement rather than simple serial.\"},\n    \"CHR_06\": {\"value\": \"TROCHOSPIRAL\", \"state\": \"PRESENT\", \"reason\": \"The test shows a spiraling coil with chambers visible across whorls.\"},\n    \"CHR_07\": {\"value\": \"SINGLE_PLANE\", \"state\": \"UNCERTAIN\", \"reason\": \"Coiling appears mostly in a single plane or slight trochospire, hard to confirm fully from one view.\"},\n    \"CHR_08\": {\"value\": \"INVOLUTE\", \"state\": \"UNCERTAIN\", \"reason\": \"Later whorls seem to embrace earlier ones.\"},\n    \"CHR_09\": {\"value\": \"NONE\", \"state\": \"PRESENT\", \"reason\": \"No major ontogenetic change in coiling mode is observed.\"},\n    \"CHR_10\": {\"value\": \"SUBDIVIDED\", \"state\": \"PRESENT\", \"reason\": \"Chambers show internal structural partitions or alveolar/subdivided features.\"},\n    \"CHR_11\": {\"value\": \"NOT_OBSERVABLE\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Secondary chamberlets cannot be clearly confirmed at this magnification.\"},\n    \"CHR_12\": {\"value\": \"SIMPLE\", \"state\": \"PRESENT\", \"reason\": \"Central proloculus/embryonic area is relatively simple.\"},\n    \"CHR_13\": {\"value\": \"RADIAL\", \"state\": \"PRESENT\", \"reason\": \"Internal radial partitions or septula are visible inside chambers.\"},\n    \"CHR_14\": {\"value\": \"ABSENT\", \"state\": \"ABSENT\", \"reason\": \"No distinct pillars are observed in the section.\"},\n    \"CHR_15\": {\"value\": \"NOT_OBSERVABLE\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Lateral chamberlets are not visible.\"},\n    \"CHR_16\": {\"value\": \"NOT_OBSERVABLE\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Aperture is not exposed in this section plane.\"},\n    \"CHR_17\": {\"value\": \"ABSENT\", \"state\": \"ABSENT\", \"reason\": \"No distinct marginal cord is present.\"},\n    \"CHR_18\": {\"value\": \"ABSENT\", \"state\": \"ABSENT\", \"reason\": \"Septal filaments cannot be observed on this thin section view.\"},\n    \"CHR_19\": {\"value\": \"FREE\", \"state\": \"PRESENT\", \"reason\": \"The form appears to be a free-living benthic foraminifer.\"},\n    \"CHR_20\": {\"value\": \"NOT_OBSERVABLE\", \"state\": \"NOT_OBSERVABLE\", \"reason\": \"Dimorphism cannot be determined from a single specimen section.\"},\n    \"CHR_21\": {\"value\": \"EQUATORIAL\", \"state\": \"PRESENT\", \"reason\": \"The view represents a nearly equatorial section through the coiling plane.\"}\n  },\n  \"module\": \"AGGLUTINATED\",\n  \"vlm_suggestion\": {\n    \"identification_status\": \"CANDIDATE_GENUS\",\n    \"best_open_id\": \"Pfenderina sp.\",\n    \"candidate_genera\": [\n      {\"name\": \"Pfenderina\", \"confidence\": \"low\", \"why\": \"Shows labyrinthic or subdivided internal chamber structures in a trochospiral/coiled test.\"},\n      {\"name\": \"Valvulammina\", \"confidence\": \"low\", \"why\": \"Agglutinated wall with complex chamber arrangements.\"}\n    ],\n    \"lookalikes\": [\"Kurnubia\", \"Pfenderina\"],\n    \"why_not_species_level\": \"Thin section orientation and lack of stratigraphic context prevent reliable species-level determination.\"\n  },\n  \"student_explanation_en\": \"This image shows an equatorial thin section of an agglutinated foraminifer. You can observe multiple chambers arranged in a coiled spiral, along with internal partitions subdividing the chamber interiors. The wall is composed of agglutinated material.\",\n  \"student_explanation_tr\": \"Bu görüntü, aglütine duvarlı bir foraminiferin ekvatoryal ince kesitini göstermektedir. Sargılı bir düzende dizilmiş çok sayıda oda ve oda içlerini bölen iç bölmeler açıkça görülmektedir.\",\n  \"expert_checklist_tr\": [\n    \"Aglütine duvar yapısının kum tanecikleri veya mikrogranüller açısından incelenmesi\",\n    \"Oda içindeki ikincil bölmelerin (septula/labyrinthic yapı) netleştirilmesi\",\n    \"Kesit düzleminin ekvatoryal mi yoksa eksenel mi olduğunun teyit edilmesi\"\n  ],\n  \"disclaimer_tr\": \"Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir.\"\n}",
                  "thoughtSignature": "EmAKXgFpFH0TK9oSJFq2jLRbEn6PloQ+S4/jjS10AdpQ90cfc8iaXpb8XlewHz3OcaIee260Mua7Z0/Kas/d1rK7xBO9gyhlPXTHHlM8uAilf8eprKE6LFj3MW/3/8jl0mQ="
                }
              ],
              "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 3272,
          "candidatesTokenCount": 1268,
          "totalTokenCount": 4540,
          "promptTokensDetails": [
            {
              "modality": "TEXT",
              "tokenCount": 2183
            },
            {
              "modality": "IMAGE",
              "tokenCount": 1089
            }
          ],
          "serviceTier": "standard"
        },
        "modelVersion": "gemini-3.5-flash-lite",
        "responseId": "uZLxauTsLML8nsEPjpn1wA4"
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
          "value": "AGGLUTINATED",
          "state": "PRESENT",
          "reason": "The wall appears thick and granular with agglutinated particles."
        },
        "CHR_02": {
          "value": "LENTICULAR",
          "state": "PRESENT",
          "reason": "The overall shape in section is compressed or lens-like."
        },
        "CHR_03": {
          "value": "PRESENT",
          "state": "PRESENT",
          "reason": "Clear septa divide the chambers."
        },
        "CHR_04": {
          "value": "MULTICHAMBERED",
          "state": "PRESENT",
          "reason": "Multiple chambers are clearly visible in the section."
        },
        "CHR_05": {
          "value": "OTHER",
          "state": "PRESENT",
          "reason": "Chambers follow a coiled arrangement rather than simple serial."
        },
        "CHR_06": {
          "value": "TROCHOSPIRAL",
          "state": "PRESENT",
          "reason": "The test shows a spiraling coil with chambers visible across whorls."
        },
        "CHR_07": {
          "value": "SINGLE_PLANE",
          "state": "PRESENT",
          "reason": "Coiling appears mostly in a single plane or slight trochospire, hard to confirm fully from one view."
        },
        "CHR_08": {
          "value": "INVOLUTE",
          "state": "PRESENT",
          "reason": "Later whorls seem to embrace earlier ones."
        },
        "CHR_09": {
          "value": "NONE",
          "state": "PRESENT",
          "reason": "No major ontogenetic change in coiling mode is observed."
        },
        "CHR_10": {
          "value": "SUBDIVIDED",
          "state": "PRESENT",
          "reason": "Chambers show internal structural partitions or alveolar/subdivided features."
        },
        "CHR_11": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Secondary chamberlets cannot be clearly confirmed at this magnification."
        },
        "CHR_12": {
          "value": "SIMPLE",
          "state": "PRESENT",
          "reason": "Central proloculus/embryonic area is relatively simple."
        },
        "CHR_13": {
          "value": "RADIAL",
          "state": "PRESENT",
          "reason": "Internal radial partitions or septula are visible inside chambers."
        },
        "CHR_14": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "No distinct pillars are observed in the section."
        },
        "CHR_15": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Lateral chamberlets are not visible."
        },
        "CHR_16": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Aperture is not exposed in this section plane."
        },
        "CHR_17": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "No distinct marginal cord is present."
        },
        "CHR_18": {
          "value": "ABSENT",
          "state": "PRESENT",
          "reason": "Septal filaments cannot be observed on this thin section view."
        },
        "CHR_19": {
          "value": "FREE",
          "state": "PRESENT",
          "reason": "The form appears to be a free-living benthic foraminifer."
        },
        "CHR_20": {
          "value": "NOT_OBSERVABLE",
          "state": "NOT_OBSERVABLE",
          "reason": "Dimorphism cannot be determined from a single specimen section."
        },
        "CHR_21": {
          "value": "EQUATORIAL",
          "state": "PRESENT",
          "reason": "The view represents a nearly equatorial section through the coiling plane."
        }
      },
      "module": "AGGLUTINATED",
      "vlm_suggestion": {
        "identification_status": "CANDIDATE_GENUS",
        "best_open_id": "Pfenderina sp.",
        "candidate_genera": [
          {
            "name": "Pfenderina",
            "confidence": "low",
            "why": "Shows labyrinthic or subdivided internal chamber structures in a trochospiral/coiled test."
          },
          {
            "name": "Valvulammina",
            "confidence": "low",
            "why": "Agglutinated wall with complex chamber arrangements."
          }
        ],
        "lookalikes": [
          "Kurnubia",
          "Pfenderina"
        ],
        "why_not_species_level": "Thin section orientation and lack of stratigraphic context prevent reliable species-level determination."
      },
      "student_explanation_en": "This image shows an equatorial thin section of an agglutinated foraminifer. You can observe multiple chambers arranged in a coiled spiral, along with internal partitions subdividing the chamber interiors. The wall is composed of agglutinated material.",
      "student_explanation_tr": "Bu görüntü, aglütine duvarlı bir foraminiferin ekvatoryal ince kesitini göstermektedir. Sargılı bir düzende dizilmiş çok sayıda oda ve oda içlerini bölen iç bölmeler açıkça görülmektedir.",
      "expert_checklist_tr": [
        "Aglütine duvar yapısının kum tanecikleri veya mikrogranüller açısından incelenmesi",
        "Oda içindeki ikincil bölmelerin (septula/labyrinthic yapı) netleştirilmesi",
        "Kesit düzleminin ekvatoryal mi yoksa eksenel mi olduğunun teyit edilmesi"
      ],
      "disclaimer_tr": "Bu bir öğretim ve karar-destek çıktısıdır; resmi taksonomik teşhis değildir."
    },
    "score": null
  },
  "score": {
    "module": "AGGLUTINATED",
    "status": "CONFIRMED_GENUS",
    "identification": "Trochammina",
    "confidenceNote": null,
    "ranking": [
      {
        "genus": "Trochammina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 17,
        "mandatoryTotal": 4,
        "mandatoryMatched": 4,
        "mandatoryViolated": [],
        "diagnosticMatched": [
          "Low trochospiral chamber arrangement"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          },
          {
            "level": "M",
            "text": "Trochospiral",
            "detail": "CHR_06=TROCHOSPIRAL"
          },
          {
            "level": "D",
            "text": "Low trochospiral chamber arrangement",
            "detail": "CHR_06=TROCHOSPIRAL"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Spiral and umbilical sides distinguishable"
          },
          {
            "level": "D",
            "text": "Chambers commonly inflated"
          },
          {
            "level": "S",
            "text": "Umbilical region may be conspicuous"
          },
          {
            "level": "S",
            "text": "Relatively simple chamber interiors"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Recurvoides",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Coiled"
          },
          {
            "level": "D",
            "text": "Coiling axis changes during ontogeny"
          },
          {
            "level": "D",
            "text": "Different sections may show different apparent coiling planes"
          },
          {
            "level": "S",
            "text": "Compact/subglobular test"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Ammobaculites",
        "module": "AGGLUTINATED",
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
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "S",
            "text": "Clear transition between coiled and straight portions"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Spiroplectammina",
        "module": "AGGLUTINATED",
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
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "S",
            "text": "Initial coil visible when preservation/section permits"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Karrerulina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 7,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Fine-grained agglutinated wall"
        ],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "S",
            "text": "Fine-grained agglutinated wall",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Serial/coiled ontogenetic development"
          },
          {
            "level": "D",
            "text": "Later distinctly serial adult growth"
          },
          {
            "level": "S",
            "text": "Compact early growth"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Gaudryina",
        "module": "AGGLUTINATED",
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
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Septate"
          },
          {
            "level": "D",
            "text": "Distinct ontogenetic reduction in number of chamber rows"
          },
          {
            "level": "S",
            "text": "Triangular early cross-section"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Clavulina",
        "module": "AGGLUTINATED",
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
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Septate"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Rzehakina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 1,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "Typical low trochospiral architecture [CHR_06=TROCHOSPIRAL]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Septate"
          },
          {
            "level": "D",
            "text": "Arrangement may appear transitional between enrolled and serial organization"
          },
          {
            "level": "S",
            "text": "Bilateral compression"
          },
          {
            "level": "S",
            "text": "Distinctive slit-like terminal apertural organization in suitable material"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      },
      {
        "genus": "Dorothia",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 1,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "Persistently low trochospiral test [CHR_06=TROCHOSPIRAL]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Serial chamber arrangement"
          },
          {
            "level": "S",
            "text": "Comparatively thick test"
          },
          {
            "level": "S",
            "text": "Distinct apertural morphology where visible"
          }
        ],
        "excluded": false,
        "exclusionReason": null
      }
    ],
    "excluded": [
      {
        "genus": "Ammodiscus",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Undivided tubular chamber (Bölünmemiş tübüler loca) [CHR_04=UNDIVIDED, CHR_02=TUBULAR]",
          "True septa = Absent (Gerçek septa yok) [CHR_03=ABSENT]"
        ],
        "diagnosticMatched": [
          "Coiling remains essentially in one plane (Sarılım esas olarak tek düzlemde)"
        ],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "True septa present [CHR_03=PRESENT]",
          "Multichambered organization [CHR_04=MULTICHAMBERED]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Test composition = Agglutinated (Kavkı = Aglütinat)",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "D",
            "text": "Coiling remains essentially in one plane (Sarılım esas olarak tek düzlemde)",
            "detail": "CHR_07=SINGLE_PLANE"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Test = Coiled (Kavkı sarılmış)"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Undivided tubular chamber (Bölünmemiş tübüler loca) [CHR_04=UNDIVIDED, CHR_02=TUBULAR]"
      },
      {
        "genus": "Glomospira",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Undivided tubular chamber [CHR_04=UNDIVIDED, CHR_02=TUBULAR]",
          "True septa absent [CHR_03=ABSENT]",
          "Coiled tubular test [CHR_02=TUBULAR]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "True chamber septa present [CHR_03=PRESENT]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "S",
            "text": "Compact, tangled or subglobular outline"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Undivided tubular chamber [CHR_04=UNDIVIDED, CHR_02=TUBULAR]"
      },
      {
        "genus": "Saccammina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Undivided single cavity [CHR_04=UNDIVIDED]",
          "Globular/subglobular or sac-like test [CHR_02=GLOBULAR]",
          "Septa absent [CHR_03=ABSENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "True multichambered organization [CHR_04=MULTICHAMBERED]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "No tubular coiling"
          },
          {
            "level": "S",
            "text": "Aperture usually simple"
          },
          {
            "level": "S",
            "text": "Wall finer/more coherent than typical coarse *Psammosphaera*"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Undivided single cavity [CHR_04=UNDIVIDED]"
      },
      {
        "genus": "Psammosphaera",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Single undivided cavity [CHR_04=UNDIVIDED]",
          "Globular test [CHR_02=GLOBULAR]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "Planispiral/trochospiral organization [CHR_06=TROCHOSPIRAL]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Wall conspicuously constructed from relatively coarse sediment grains"
          },
          {
            "level": "D",
            "text": "Very simple spherical architecture"
          },
          {
            "level": "S",
            "text": "Irregular external surface"
          },
          {
            "level": "S",
            "text": "No coiling"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Single undivided cavity [CHR_04=UNDIVIDED]"
      },
      {
        "genus": "Bathysiphon",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": -2,
        "mandatoryTotal": 4,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Undivided tubular chamber [CHR_04=UNDIVIDED, CHR_02=TUBULAR]",
          "Uncoiled [CHR_06=UNCOILED]",
          "Septa absent [CHR_03=ABSENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [
          "Multichambered/septate test [CHR_04=MULTICHAMBERED]"
        ],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "S",
            "text": "Simple internal cavity"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Undivided tubular chamber [CHR_04=UNDIVIDED, CHR_02=TUBULAR]"
      },
      {
        "genus": "Rhabdammina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 4,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Tubular architecture [CHR_02=TUBULAR]",
          "Septa absent or no conventional chamber series [CHR_03=ABSENT]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Coarse agglutinated wall"
        ],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "S",
            "text": "Coarse agglutinated wall",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Strong branching"
          },
          {
            "level": "D",
            "text": "Branches commonly radiate from a central area"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Tubular architecture [CHR_02=TUBULAR]"
      },
      {
        "genus": "Rhizammina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 4,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Slender tubular architecture [CHR_02=TUBULAR]",
          "No conventional multichambered organization [CHR_04=UNDIVIDED]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Fine agglutinated wall"
        ],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "S",
            "text": "Fine agglutinated wall",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Very thin, flexible, irregularly branching/tangled tubes"
          },
          {
            "level": "D",
            "text": "Less robust and less radially organized than *Rhabdammina*"
          },
          {
            "level": "S",
            "text": "Irregular network-like appearance"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Slender tubular architecture [CHR_02=TUBULAR]"
      },
      {
        "genus": "Reophax",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Uniserial [CHR_05=UNISERIAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Chambers arranged sequentially in a single row"
          },
          {
            "level": "D",
            "text": "Connections generally less distinctly necked than in *Hormosina*"
          },
          {
            "level": "S",
            "text": "Irregular chamber enlargement"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Uniserial [CHR_05=UNISERIAL]"
      },
      {
        "genus": "Hormosina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Uniserial [CHR_05=UNISERIAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Adjacent chambers linked by conspicuously narrow necks"
          },
          {
            "level": "D",
            "text": "Bead- or necklace-like appearance"
          },
          {
            "level": "S",
            "text": "Chambers relatively regular in shape"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Uniserial [CHR_05=UNISERIAL]"
      },
      {
        "genus": "Caudammina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 7,
        "mandatoryTotal": 3,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "Uniserial/serial organization [CHR_05=UNISERIAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [
          "Robust deep-water agglutinated morphology"
        ],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "S",
            "text": "Robust deep-water agglutinated morphology",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Uniserial/serial organization [CHR_05=UNISERIAL]"
      },
      {
        "genus": "Haplophragmoides",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Planispiral [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Chambers internally simple"
          },
          {
            "level": "S",
            "text": "Rounded peripheral chambers"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Planispiral [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Reticulophragmium",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Planispiral/recurvoid-related architecture [CHR_06=PLANISPIRAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Internal subdivision present",
            "detail": "CHR_10=SUBDIVIDED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Internal structure substantially more complex than *Haplophragmoides*"
          },
          {
            "level": "S",
            "text": "Relatively large, compact test"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Planispiral/recurvoid-related architecture [CHR_06=PLANISPIRAL]"
      },
      {
        "genus": "Textularia",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Biserial adult arrangement [CHR_05=BISERIAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Septa present",
            "detail": "CHR_03=PRESENT"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Chambers alternate regularly in two rows"
          },
          {
            "level": "S",
            "text": "Interiomarginal aperture"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Biserial adult arrangement [CHR_05=BISERIAL]"
      },
      {
        "genus": "Coskinolina",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 6,
        "mandatoryTotal": 5,
        "mandatoryMatched": 2,
        "mandatoryViolated": [
          "Conical/orbitoliniform morphology [CHR_02=CONICAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Large benthic test"
          },
          {
            "level": "M",
            "text": "Internal differentiation present"
          },
          {
            "level": "D",
            "text": "**No developed beams/rafters subdividing the marginal chamber lumen**"
          },
          {
            "level": "S",
            "text": "Pseudokeriothecal wall structure"
          },
          {
            "level": "S",
            "text": "Large shallow-water benthic morphology"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Conical/orbitoliniform morphology [CHR_02=CONICAL]"
      },
      {
        "genus": "Dictyoconus",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 9,
        "mandatoryTotal": 4,
        "mandatoryMatched": 3,
        "mandatoryViolated": [
          "Large conical benthic test [CHR_02=CONICAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          },
          {
            "level": "M",
            "text": "Multichambered",
            "detail": "CHR_04=MULTICHAMBERED"
          },
          {
            "level": "M",
            "text": "Complex internal subdivision",
            "detail": "CHR_10=SUBDIVIDED"
          }
        ],
        "neutralRules": [
          {
            "level": "D",
            "text": "Strongly differentiated internal architecture"
          },
          {
            "level": "D",
            "text": "Numerous radial/secondary subdivisions"
          },
          {
            "level": "S",
            "text": "Complex marginal and central chamber differentiation"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Large conical benthic test [CHR_02=CONICAL]"
      },
      {
        "genus": "Barattolites",
        "module": "AGGLUTINATED",
        "flag": null,
        "taxonomicReviewRequired": false,
        "score": 3,
        "mandatoryTotal": 3,
        "mandatoryMatched": 1,
        "mandatoryViolated": [
          "Large conical/orbitoliniform test [CHR_02=CONICAL]"
        ],
        "diagnosticMatched": [],
        "diagnosticUnobservable": [],
        "supportingMatched": [],
        "contradictions": [],
        "matchedEvidence": [
          {
            "level": "M",
            "text": "Agglutinated",
            "detail": "CHR_01=AGGLUTINATED"
          }
        ],
        "neutralRules": [
          {
            "level": "M",
            "text": "Complex internally partitioned architecture"
          },
          {
            "level": "S",
            "text": "Shallow-water larger benthic architecture"
          }
        ],
        "excluded": true,
        "exclusionReason": "mandatory character incompatible: Large conical/orbitoliniform test [CHR_02=CONICAL]"
      }
    ]
  }
}