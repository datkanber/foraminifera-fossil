{
  "executedAt": "2026-11-09T09:22:26.840Z",
  "mutations": false,
  "results": [
    {
      "id": "CQ1",
      "question": "Rules and expected states defining module m",
      "parameters": {
        "m": "AGGLUTINATED"
      },
      "query": "MATCH (g:Genus)-[:BELONGS_TO]->(:Module {name:$m}) MATCH (g)-[h:HAS_RULE]->(r) OPTIONAL MATCH (r)-[x:REFERS_TO]->(c:Character) RETURN g.name AS genus, h.level AS level, c.id AS character, x.suggestedValue AS state",
      "returned": [
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Ammodiscus",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Ammodiscus",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammodiscus",
          "level": "DIAGNOSTIC",
          "character": "CHR_07",
          "state": "SINGLE_PLANE"
        },
        {
          "genus": "Ammodiscus",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "DISCOIDAL"
        },
        {
          "genus": "Ammodiscus",
          "level": "SUPPORTING",
          "character": "CHR_10",
          "state": "SIMPLE"
        },
        {
          "genus": "Ammodiscus",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Ammodiscus",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Ammodiscus",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Glomospira",
          "level": "DIAGNOSTIC",
          "character": "CHR_07",
          "state": "CHANGING_PLANES"
        },
        {
          "genus": "Glomospira",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "GLOMOSPIRAL"
        },
        {
          "genus": "Glomospira",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Glomospira",
          "level": "SUPPORTING",
          "character": "CHR_10",
          "state": "SIMPLE"
        },
        {
          "genus": "Glomospira",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Glomospira",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Saccammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "SAC_LIKE"
        },
        {
          "genus": "Saccammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Saccammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Saccammina",
          "level": "SUPPORTING",
          "character": "CHR_16",
          "state": null
        },
        {
          "genus": "Saccammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Psammosphaera",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Psammosphaera",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Psammosphaera",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Psammosphaera",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "UNCOILED"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Bathysiphon",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Bathysiphon",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Bathysiphon",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Bathysiphon",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhabdammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhabdammina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhabdammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Rhabdammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhabdammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhabdammina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhabdammina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "IRREGULAR"
        },
        {
          "genus": "Rhabdammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhabdammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Rhizammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhizammina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhizammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Rhizammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhizammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhizammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Reophax",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Reophax",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Reophax",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Reophax",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Reophax",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Hormosina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Hormosina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Caudammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Caudammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Caudammina",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Caudammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Caudammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Caudammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Caudammina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Caudammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Caudammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Haplophragmoides",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "DIAGNOSTIC",
          "character": "CHR_08",
          "state": "SEMI_INVOLUTE"
        },
        {
          "genus": "Haplophragmoides",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "DISCOIDAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "UNCOILED"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "STREPTOSPIRAL"
        },
        {
          "genus": "Recurvoides",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Recurvoides",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Ammobaculites",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Ammobaculites",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Ammobaculites",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Ammobaculites",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "UNCOILED"
        },
        {
          "genus": "Ammobaculites",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Ammobaculites",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "PLANISPIRAL_TO_BISERIAL"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_10",
          "state": "SUBDIVIDED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "DIAGNOSTIC",
          "character": "CHR_10",
          "state": "LABYRINTHIC"
        },
        {
          "genus": "Reticulophragmium",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Reticulophragmium",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Reticulophragmium",
          "level": "SUPPORTING",
          "character": "CHR_08",
          "state": "SEMI_INVOLUTE"
        },
        {
          "genus": "Reticulophragmium",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Trochammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Trochammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Trochammina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Rzehakina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rzehakina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Rzehakina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Rzehakina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "IRREGULAR_SERIAL"
        },
        {
          "genus": "Rzehakina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Rzehakina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Rzehakina",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Textularia",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Textularia",
          "level": "SUPPORTING",
          "character": "CHR_16",
          "state": "INTERIOMARGINAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Spiroplectammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Spiroplectammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Spiroplectammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Spiroplectammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "PLANISPIRAL_TO_UNISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Gaudryina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Gaudryina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Gaudryina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "TRISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Gaudryina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Gaudryina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Gaudryina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Gaudryina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_UNISERIAL"
        },
        {
          "genus": "Dorothia",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Dorothia",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Dorothia",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Dorothia",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Dorothia",
          "level": "DIAGNOSTIC",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_BISERIAL"
        },
        {
          "genus": "Dorothia",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Dorothia",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Dorothia",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Dorothia",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Dorothia",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Dorothia",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Clavulina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Clavulina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Clavulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "TRISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Clavulina",
          "level": "SUPPORTING",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_BISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Karrerulina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Karrerulina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Karrerulina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "TRISERIAL"
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_16",
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Karrerulina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Karrerulina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "DIAGNOSTIC",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Coskinolina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Coskinolina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "CONTRADICTORY",
          "character": "CHR_13",
          "state": "VERTICAL"
        },
        {
          "genus": "Coskinolina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_10",
          "state": "SUBDIVIDED"
        },
        {
          "genus": "Dictyoconus",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "DIAGNOSTIC",
          "character": "CHR_10",
          "state": "RETICULATE"
        },
        {
          "genus": "Dictyoconus",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Dictyoconus",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Dictyoconus",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Barattolites",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Barattolites",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "HIGH_CONICAL"
        },
        {
          "genus": "Barattolites",
          "level": "DIAGNOSTIC",
          "character": "CHR_13",
          "state": "SUBEPIDERMAL"
        },
        {
          "genus": "Barattolites",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "CONTRADICTORY",
          "character": "CHR_10",
          "state": "SIMPLE"
        },
        {
          "genus": "Barattolites",
          "level": "CONTRADICTORY",
          "character": "CHR_13",
          "state": "ABSENT"
        }
      ],
      "row_count": 276,
      "expected": [
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Ammodiscus",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Ammodiscus",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammodiscus",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Ammodiscus",
          "level": "DIAGNOSTIC",
          "character": "CHR_07",
          "state": "SINGLE_PLANE"
        },
        {
          "genus": "Ammodiscus",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "DISCOIDAL"
        },
        {
          "genus": "Ammodiscus",
          "level": "SUPPORTING",
          "character": "CHR_10",
          "state": "SIMPLE"
        },
        {
          "genus": "Ammodiscus",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Ammodiscus",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Ammodiscus",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Glomospira",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Glomospira",
          "level": "DIAGNOSTIC",
          "character": "CHR_07",
          "state": "CHANGING_PLANES"
        },
        {
          "genus": "Glomospira",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "GLOMOSPIRAL"
        },
        {
          "genus": "Glomospira",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Glomospira",
          "level": "SUPPORTING",
          "character": "CHR_10",
          "state": "SIMPLE"
        },
        {
          "genus": "Glomospira",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Glomospira",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Saccammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Saccammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Saccammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "SAC_LIKE"
        },
        {
          "genus": "Saccammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Saccammina",
          "level": "SUPPORTING",
          "character": "CHR_16",
          "state": null
        },
        {
          "genus": "Saccammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Saccammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Psammosphaera",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Psammosphaera",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Psammosphaera",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Psammosphaera",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Psammosphaera",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "UNCOILED"
        },
        {
          "genus": "Bathysiphon",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Bathysiphon",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Bathysiphon",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Bathysiphon",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Bathysiphon",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Bathysiphon",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhabdammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhabdammina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhabdammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Rhabdammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhabdammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhabdammina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhabdammina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "IRREGULAR"
        },
        {
          "genus": "Rhabdammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhabdammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Rhizammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhizammina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhizammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Rhizammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rhizammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Rhizammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Rhizammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Reophax",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Reophax",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Reophax",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Reophax",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Reophax",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Reophax",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Reophax",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Hormosina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Hormosina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Hormosina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Hormosina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Caudammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Caudammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Caudammina",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Caudammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Caudammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Caudammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Caudammina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Caudammina",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "GLOBULAR"
        },
        {
          "genus": "Caudammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Haplophragmoides",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Haplophragmoides",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "DIAGNOSTIC",
          "character": "CHR_08",
          "state": "SEMI_INVOLUTE"
        },
        {
          "genus": "Haplophragmoides",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "DISCOIDAL"
        },
        {
          "genus": "Haplophragmoides",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_02",
          "state": "TUBULAR"
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "UNCOILED"
        },
        {
          "genus": "Haplophragmoides",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Recurvoides",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "STREPTOSPIRAL"
        },
        {
          "genus": "Recurvoides",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Recurvoides",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Recurvoides",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Ammobaculites",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Ammobaculites",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Ammobaculites",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Ammobaculites",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "UNCOILED"
        },
        {
          "genus": "Ammobaculites",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Ammobaculites",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Ammobaculites",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "PLANISPIRAL_TO_BISERIAL"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Reticulophragmium",
          "level": "MANDATORY",
          "character": "CHR_10",
          "state": "SUBDIVIDED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "DIAGNOSTIC",
          "character": "CHR_10",
          "state": "LABYRINTHIC"
        },
        {
          "genus": "Reticulophragmium",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Reticulophragmium",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Reticulophragmium",
          "level": "SUPPORTING",
          "character": "CHR_08",
          "state": "SEMI_INVOLUTE"
        },
        {
          "genus": "Reticulophragmium",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Reticulophragmium",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Trochammina",
          "level": "MANDATORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Trochammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Trochammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Trochammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Trochammina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Rzehakina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Rzehakina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Rzehakina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Rzehakina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "IRREGULAR_SERIAL"
        },
        {
          "genus": "Rzehakina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Rzehakina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Rzehakina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Rzehakina",
          "level": "CONTRADICTORY",
          "character": "CHR_03",
          "state": "ABSENT"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Textularia",
          "level": "MANDATORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Textularia",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Textularia",
          "level": "SUPPORTING",
          "character": "CHR_16",
          "state": "INTERIOMARGINAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_BISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Textularia",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Spiroplectammina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Spiroplectammina",
          "level": "MANDATORY",
          "character": "CHR_03",
          "state": "PRESENT"
        },
        {
          "genus": "Spiroplectammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Spiroplectammina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Spiroplectammina",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "PLANISPIRAL_TO_UNISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Gaudryina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Gaudryina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Gaudryina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "TRISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Gaudryina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Gaudryina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Gaudryina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Gaudryina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Gaudryina",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_UNISERIAL"
        },
        {
          "genus": "Dorothia",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Dorothia",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Dorothia",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Dorothia",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Dorothia",
          "level": "DIAGNOSTIC",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_BISERIAL"
        },
        {
          "genus": "Dorothia",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Dorothia",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Dorothia",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Dorothia",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Dorothia",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Dorothia",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Clavulina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Clavulina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Clavulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "TRISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "ELONGATE"
        },
        {
          "genus": "Clavulina",
          "level": "SUPPORTING",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "CONTRADICTORY",
          "character": "CHR_09",
          "state": "TRISERIAL_TO_BISERIAL"
        },
        {
          "genus": "Clavulina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "UNISERIAL"
        },
        {
          "genus": "Karrerulina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Karrerulina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Karrerulina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_06",
          "state": "TROCHOSPIRAL"
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_05",
          "state": "TRISERIAL"
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_16",
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Karrerulina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Karrerulina",
          "level": "SUPPORTING",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Karrerulina",
          "level": "CONTRADICTORY",
          "character": "CHR_06",
          "state": "PLANISPIRAL"
        },
        {
          "genus": "Karrerulina",
          "level": "CONTRADICTORY",
          "character": "CHR_05",
          "state": "BISERIAL"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Coskinolina",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "DIAGNOSTIC",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Coskinolina",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Coskinolina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Coskinolina",
          "level": "CONTRADICTORY",
          "character": "CHR_13",
          "state": "VERTICAL"
        },
        {
          "genus": "Coskinolina",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_04",
          "state": "MULTICHAMBERED"
        },
        {
          "genus": "Dictyoconus",
          "level": "MANDATORY",
          "character": "CHR_10",
          "state": "SUBDIVIDED"
        },
        {
          "genus": "Dictyoconus",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "DIAGNOSTIC",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "DIAGNOSTIC",
          "character": "CHR_10",
          "state": "RETICULATE"
        },
        {
          "genus": "Dictyoconus",
          "level": "SUPPORTING",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Dictyoconus",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Dictyoconus",
          "level": "CONTRADICTORY",
          "character": "CHR_04",
          "state": "UNDIVIDED"
        },
        {
          "genus": "Dictyoconus",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "MANDATORY",
          "character": "CHR_01",
          "state": "AGGLUTINATED"
        },
        {
          "genus": "Barattolites",
          "level": "MANDATORY",
          "character": "CHR_02",
          "state": "CONICAL"
        },
        {
          "genus": "Barattolites",
          "level": "MANDATORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "DIAGNOSTIC",
          "character": "CHR_02",
          "state": "HIGH_CONICAL"
        },
        {
          "genus": "Barattolites",
          "level": "DIAGNOSTIC",
          "character": "CHR_13",
          "state": "SUBEPIDERMAL"
        },
        {
          "genus": "Barattolites",
          "level": "SUPPORTING",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "CONTRADICTORY",
          "character": null,
          "state": null
        },
        {
          "genus": "Barattolites",
          "level": "CONTRADICTORY",
          "character": "CHR_10",
          "state": "SIMPLE"
        },
        {
          "genus": "Barattolites",
          "level": "CONTRADICTORY",
          "character": "CHR_13",
          "state": "ABSENT"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 630
    },
    {
      "id": "CQ2",
      "question": "Mandatory rules of genus g referring to character c",
      "parameters": {
        "g": "Ammodiscus",
        "c": "CHR_03"
      },
      "query": "MATCH (:Genus {name:$g})-[:HAS_RULE {level:'MANDATORY'}]->(r)-[x:REFERS_TO]->(:Character {id:$c}) RETURN r.text AS text, x.suggestedValue AS state",
      "returned": [
        {
          "text": "True septa = Absent (Gerçek septa yok)",
          "state": "ABSENT"
        }
      ],
      "row_count": 1,
      "expected": [
        {
          "text": "True septa = Absent (Gerçek septa yok)",
          "state": "ABSENT"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 81
    },
    {
      "id": "CQ3",
      "question": "Genera sharing a diagnostic state with g",
      "parameters": {
        "g": "Ammodiscus"
      },
      "query": "MATCH (a:Genus {name:$g})-[:HAS_RULE {level:'DIAGNOSTIC'}]->()-[x:REFERS_TO]->(c)<-[y:REFERS_TO]-()<-[:HAS_RULE {level:'DIAGNOSTIC'}]-(b:Genus) WHERE a<>b AND x.suggestedValue=y.suggestedValue RETURN b.name AS genus, c.id AS character",
      "returned": [
        {
          "genus": "Bathysiphon",
          "character": "CHR_02"
        },
        {
          "genus": "Bathysiphon",
          "character": "CHR_02"
        },
        {
          "genus": "Caudammina",
          "character": "CHR_02"
        },
        {
          "genus": "Glomalveolina",
          "character": "CHR_06"
        },
        {
          "genus": "Peneroplis",
          "character": "CHR_06"
        },
        {
          "genus": "Haplophragmoides",
          "character": "CHR_06"
        },
        {
          "genus": "Ammobaculites",
          "character": "CHR_06"
        },
        {
          "genus": "Spiroplectammina",
          "character": "CHR_06"
        },
        {
          "genus": "Alveolina",
          "character": "CHR_06"
        }
      ],
      "row_count": 9,
      "expected": [
        {
          "genus": "Haplophragmoides",
          "character": "CHR_06"
        },
        {
          "genus": "Ammobaculites",
          "character": "CHR_06"
        },
        {
          "genus": "Spiroplectammina",
          "character": "CHR_06"
        },
        {
          "genus": "Alveolina",
          "character": "CHR_06"
        },
        {
          "genus": "Glomalveolina",
          "character": "CHR_06"
        },
        {
          "genus": "Peneroplis",
          "character": "CHR_06"
        },
        {
          "genus": "Bathysiphon",
          "character": "CHR_02"
        },
        {
          "genus": "Bathysiphon",
          "character": "CHR_02"
        },
        {
          "genus": "Caudammina",
          "character": "CHR_02"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 83
    },
    {
      "id": "CQ4",
      "question": "States allowed for character c",
      "parameters": {
        "c": "CHR_03"
      },
      "query": "MATCH (:Character {id:$c})-[:ALLOWS]->(v:Value) RETURN v.code AS state",
      "returned": [
        {
          "state": "PRESENT"
        },
        {
          "state": "ABSENT"
        },
        {
          "state": "NOT_OBSERVABLE"
        },
        {
          "state": "UNCERTAIN"
        }
      ],
      "row_count": 4,
      "expected": [
        {
          "state": "PRESENT"
        },
        {
          "state": "ABSENT"
        },
        {
          "state": "NOT_OBSERVABLE"
        },
        {
          "state": "UNCERTAIN"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 79
    },
    {
      "id": "CQ5",
      "question": "Genera reachable from question q",
      "parameters": {
        "q": "AGG_Q1"
      },
      "query": "MATCH (:Question {id:$q})-[:ANSWER*1..11]->(g:Genus) RETURN DISTINCT g.name AS genus",
      "returned": [
        {
          "genus": "Saccammina"
        },
        {
          "genus": "Psammosphaera"
        },
        {
          "genus": "Ammodiscus"
        },
        {
          "genus": "Glomospira"
        },
        {
          "genus": "Coskinolina"
        },
        {
          "genus": "Bathysiphon"
        },
        {
          "genus": "Rhizammina"
        },
        {
          "genus": "Rhabdammina"
        },
        {
          "genus": "Dictyoconus"
        },
        {
          "genus": "Reophax"
        },
        {
          "genus": "Reticulophragmium"
        },
        {
          "genus": "Recurvoides"
        },
        {
          "genus": "Trochammina"
        },
        {
          "genus": "Textularia"
        },
        {
          "genus": "Ammobaculites"
        },
        {
          "genus": "Spiroplectammina"
        },
        {
          "genus": "Clavulina"
        },
        {
          "genus": "Karrerulina"
        },
        {
          "genus": "Rzehakina"
        },
        {
          "genus": "Barattolites"
        },
        {
          "genus": "Hormosina"
        },
        {
          "genus": "Haplophragmoides"
        },
        {
          "genus": "Gaudryina"
        },
        {
          "genus": "Dorothia"
        },
        {
          "genus": "Caudammina"
        }
      ],
      "row_count": 25,
      "expected": [
        {
          "genus": "Psammosphaera"
        },
        {
          "genus": "Saccammina"
        },
        {
          "genus": "Bathysiphon"
        },
        {
          "genus": "Rhizammina"
        },
        {
          "genus": "Rhabdammina"
        },
        {
          "genus": "Ammodiscus"
        },
        {
          "genus": "Glomospira"
        },
        {
          "genus": "Coskinolina"
        },
        {
          "genus": "Dictyoconus"
        },
        {
          "genus": "Barattolites"
        },
        {
          "genus": "Hormosina"
        },
        {
          "genus": "Caudammina"
        },
        {
          "genus": "Reophax"
        },
        {
          "genus": "Haplophragmoides"
        },
        {
          "genus": "Ammobaculites"
        },
        {
          "genus": "Reticulophragmium"
        },
        {
          "genus": "Recurvoides"
        },
        {
          "genus": "Trochammina"
        },
        {
          "genus": "Karrerulina"
        },
        {
          "genus": "Textularia"
        },
        {
          "genus": "Spiroplectammina"
        },
        {
          "genus": "Gaudryina"
        },
        {
          "genus": "Dorothia"
        },
        {
          "genus": "Clavulina"
        },
        {
          "genus": "Rzehakina"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 81
    },
    {
      "id": "CQ6",
      "question": "Characters never asked in the tree of module m",
      "parameters": {
        "m": "AGGLUTINATED"
      },
      "query": "MATCH (c:Character) WHERE NOT EXISTS {MATCH (:Question {module:$m})-[:ASKS_ABOUT]->(c)} RETURN c.id AS character",
      "returned": [
        {
          "character": "CHR_01"
        },
        {
          "character": "CHR_04"
        },
        {
          "character": "CHR_06"
        },
        {
          "character": "CHR_08"
        },
        {
          "character": "CHR_12"
        },
        {
          "character": "CHR_14"
        },
        {
          "character": "CHR_15"
        },
        {
          "character": "CHR_16"
        },
        {
          "character": "CHR_17"
        },
        {
          "character": "CHR_18"
        },
        {
          "character": "CHR_19"
        },
        {
          "character": "CHR_20"
        },
        {
          "character": "CHR_21"
        }
      ],
      "row_count": 13,
      "expected": [
        {
          "character": "CHR_01"
        },
        {
          "character": "CHR_04"
        },
        {
          "character": "CHR_06"
        },
        {
          "character": "CHR_08"
        },
        {
          "character": "CHR_12"
        },
        {
          "character": "CHR_14"
        },
        {
          "character": "CHR_15"
        },
        {
          "character": "CHR_16"
        },
        {
          "character": "CHR_17"
        },
        {
          "character": "CHR_18"
        },
        {
          "character": "CHR_19"
        },
        {
          "character": "CHR_20"
        },
        {
          "character": "CHR_21"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 85
    },
    {
      "id": "CQ7",
      "question": "Rules without a scoring character-state pair",
      "parameters": {},
      "query": "MATCH (r:RuleItem) WHERE NOT EXISTS {MATCH (r)-[x:REFERS_TO]->() WHERE x.suggestedValue IS NOT NULL} RETURN r.key AS rule_key",
      "returned": [
        {
          "rule_key": "Alveolina_S4"
        },
        {
          "rule_key": "Glomalveolina_S1"
        },
        {
          "rule_key": "Glomalveolina_S3"
        },
        {
          "rule_key": "Borelis_D2"
        },
        {
          "rule_key": "Borelis_D3"
        },
        {
          "rule_key": "Borelis_S1"
        },
        {
          "rule_key": "Borelis_S3"
        },
        {
          "rule_key": "Quinqueloculina_M3"
        },
        {
          "rule_key": "Quinqueloculina_D1"
        },
        {
          "rule_key": "Quinqueloculina_S1"
        },
        {
          "rule_key": "Quinqueloculina_S2"
        },
        {
          "rule_key": "Hauerina_D1"
        },
        {
          "rule_key": "Hauerina_D2"
        },
        {
          "rule_key": "Hauerina_S2"
        },
        {
          "rule_key": "Hauerina_C1"
        },
        {
          "rule_key": "Hauerina_C2"
        },
        {
          "rule_key": "Articulina_C2"
        },
        {
          "rule_key": "Triloculina_D1"
        },
        {
          "rule_key": "Triloculina_D2"
        },
        {
          "rule_key": "Triloculina_S2"
        },
        {
          "rule_key": "Triloculina_C3"
        },
        {
          "rule_key": "Miliolinella_D2"
        },
        {
          "rule_key": "Miliolinella_S1"
        },
        {
          "rule_key": "Miliolinella_C1"
        },
        {
          "rule_key": "Miliolinella_C2"
        },
        {
          "rule_key": "Pyrgo_D1"
        },
        {
          "rule_key": "Pyrgo_S1"
        },
        {
          "rule_key": "Pyrgoina_D1"
        },
        {
          "rule_key": "Pyrgoina_S1"
        },
        {
          "rule_key": "Pyrgoina_S2"
        },
        {
          "rule_key": "Pyrgoina_C2"
        },
        {
          "rule_key": "Peneroplis_D2"
        },
        {
          "rule_key": "Peneroplis_D3"
        },
        {
          "rule_key": "Coscinospira_D1"
        },
        {
          "rule_key": "Dendritina_M3"
        },
        {
          "rule_key": "Dendritina_D1"
        },
        {
          "rule_key": "Dendritina_C1"
        },
        {
          "rule_key": "Vertebralina_C1"
        },
        {
          "rule_key": "Nubecularia_S1"
        },
        {
          "rule_key": "Fabularia_D1"
        },
        {
          "rule_key": "Fabularia_S2"
        },
        {
          "rule_key": "Fabularia_S3"
        },
        {
          "rule_key": "Lacazina_M3"
        },
        {
          "rule_key": "Lacazina_S2"
        },
        {
          "rule_key": "Lacazina_C1"
        },
        {
          "rule_key": "Lacazina_C2"
        },
        {
          "rule_key": "Pseudolacazina_D2"
        },
        {
          "rule_key": "Pseudolacazina_S1"
        },
        {
          "rule_key": "Pseudolacazina_S3"
        },
        {
          "rule_key": "Lacazinella_M4"
        },
        {
          "rule_key": "Lacazinella_D1"
        },
        {
          "rule_key": "Lacazinella_D2"
        },
        {
          "rule_key": "Lacazinella_D3"
        },
        {
          "rule_key": "Lacazinella_S2"
        },
        {
          "rule_key": "Lacazinella_C2"
        },
        {
          "rule_key": "Periloculina_D1"
        },
        {
          "rule_key": "Periloculina_D2"
        },
        {
          "rule_key": "Periloculina_S2"
        },
        {
          "rule_key": "Idalina_M4"
        },
        {
          "rule_key": "Idalina_D1"
        },
        {
          "rule_key": "Idalina_D3"
        },
        {
          "rule_key": "Idalina_S1"
        },
        {
          "rule_key": "Idalina_S2"
        },
        {
          "rule_key": "Nummulites_D3"
        },
        {
          "rule_key": "Nummulites_S2"
        },
        {
          "rule_key": "Nummulites_C3"
        },
        {
          "rule_key": "Assilina_D2"
        },
        {
          "rule_key": "Assilina_D3"
        },
        {
          "rule_key": "Assilina_C2"
        },
        {
          "rule_key": "Operculina_M3"
        },
        {
          "rule_key": "Operculina_D3"
        },
        {
          "rule_key": "Operculina_D4"
        },
        {
          "rule_key": "Ranikothalia_M3"
        },
        {
          "rule_key": "Ranikothalia_S1"
        },
        {
          "rule_key": "Heterostegina_M3"
        },
        {
          "rule_key": "Spiroclypeus_M3"
        },
        {
          "rule_key": "Spiroclypeus_D3"
        },
        {
          "rule_key": "Spiroclypeus_C1"
        },
        {
          "rule_key": "Lockhartia_D2"
        },
        {
          "rule_key": "Kathina_M3"
        },
        {
          "rule_key": "Kathina_D2"
        },
        {
          "rule_key": "Daviesina_D2"
        },
        {
          "rule_key": "Miscellanea_M2"
        },
        {
          "rule_key": "Miscellanea_D2"
        },
        {
          "rule_key": "Laffitteina_D1"
        },
        {
          "rule_key": "Laffitteina_D2"
        },
        {
          "rule_key": "Rotalia_D1"
        },
        {
          "rule_key": "Pararotalia_D1"
        },
        {
          "rule_key": "Cuvillierina_M3"
        },
        {
          "rule_key": "Cuvillierina_D1"
        },
        {
          "rule_key": "Ornatorotalia_D1"
        },
        {
          "rule_key": "Granorotalia_D1"
        },
        {
          "rule_key": "Granorotalia_D2"
        },
        {
          "rule_key": "Asterocyclina_M4"
        },
        {
          "rule_key": "Asterocyclina_D1"
        },
        {
          "rule_key": "Discocyclina_M4"
        },
        {
          "rule_key": "Discocyclina_M5"
        },
        {
          "rule_key": "Discocyclina_D2"
        },
        {
          "rule_key": "Orbitoclypeus_M4"
        },
        {
          "rule_key": "Orbitoclypeus_D1"
        },
        {
          "rule_key": "Orbitoclypeus_D2"
        },
        {
          "rule_key": "Orbitoclypeus_D3"
        },
        {
          "rule_key": "Nemkovella_D1"
        },
        {
          "rule_key": "Nemkovella_D2"
        },
        {
          "rule_key": "Nemkovella_D3"
        },
        {
          "rule_key": "Lenticulina_M4"
        },
        {
          "rule_key": "Lenticulina_D2"
        },
        {
          "rule_key": "Palaeonummulites_D2"
        },
        {
          "rule_key": "Palaeonummulites_D3"
        },
        {
          "rule_key": "Palaeonummulites_D4"
        },
        {
          "rule_key": "Palaeonummulites_S2"
        },
        {
          "rule_key": "Palaeonummulites_S4"
        },
        {
          "rule_key": "Palaeonummulites_C3"
        },
        {
          "rule_key": "Nummulitoides_D3"
        },
        {
          "rule_key": "Nummulitoides_D5"
        },
        {
          "rule_key": "Nummulitoides_S1"
        },
        {
          "rule_key": "Nummulitoides_S4"
        },
        {
          "rule_key": "Nummulitoides_C5"
        },
        {
          "rule_key": "Planocamerinoides_D1"
        },
        {
          "rule_key": "Planocamerinoides_D2"
        },
        {
          "rule_key": "Planocamerinoides_D3"
        },
        {
          "rule_key": "Planocamerinoides_D5"
        },
        {
          "rule_key": "Planocamerinoides_S1"
        },
        {
          "rule_key": "Planocamerinoides_S2"
        },
        {
          "rule_key": "Planocamerinoides_S5"
        },
        {
          "rule_key": "Planocamerinoides_C2"
        },
        {
          "rule_key": "Planocamerinoides_C4"
        },
        {
          "rule_key": "Chordoperculinoides_D2"
        },
        {
          "rule_key": "Chordoperculinoides_D3"
        },
        {
          "rule_key": "Chordoperculinoides_D4"
        },
        {
          "rule_key": "Chordoperculinoides_D5"
        },
        {
          "rule_key": "Chordoperculinoides_D6"
        },
        {
          "rule_key": "Chordoperculinoides_S1"
        },
        {
          "rule_key": "Chordoperculinoides_S3"
        },
        {
          "rule_key": "Chordoperculinoides_S4"
        },
        {
          "rule_key": "Chordoperculinoides_S5"
        },
        {
          "rule_key": "Chordoperculinoides_C3"
        },
        {
          "rule_key": "Chordoperculinoides_C5"
        },
        {
          "rule_key": "Ammodiscus_M4"
        },
        {
          "rule_key": "Ammodiscus_C3"
        },
        {
          "rule_key": "Glomospira_S1"
        },
        {
          "rule_key": "Saccammina_D2"
        },
        {
          "rule_key": "Saccammina_S1"
        },
        {
          "rule_key": "Saccammina_S2"
        },
        {
          "rule_key": "Saccammina_C3"
        },
        {
          "rule_key": "Psammosphaera_D1"
        },
        {
          "rule_key": "Psammosphaera_D2"
        },
        {
          "rule_key": "Psammosphaera_S1"
        },
        {
          "rule_key": "Psammosphaera_S2"
        },
        {
          "rule_key": "Psammosphaera_C1"
        },
        {
          "rule_key": "Bathysiphon_S2"
        },
        {
          "rule_key": "Bathysiphon_C3"
        },
        {
          "rule_key": "Rhabdammina_D1"
        },
        {
          "rule_key": "Rhabdammina_D2"
        },
        {
          "rule_key": "Rhizammina_D1"
        },
        {
          "rule_key": "Rhizammina_D2"
        },
        {
          "rule_key": "Rhizammina_S1"
        },
        {
          "rule_key": "Rhizammina_C2"
        },
        {
          "rule_key": "Rhizammina_C3"
        },
        {
          "rule_key": "Reophax_D2"
        },
        {
          "rule_key": "Reophax_D3"
        },
        {
          "rule_key": "Reophax_S1"
        },
        {
          "rule_key": "Hormosina_D2"
        },
        {
          "rule_key": "Hormosina_D3"
        },
        {
          "rule_key": "Hormosina_S1"
        },
        {
          "rule_key": "Hormosina_C1"
        },
        {
          "rule_key": "Haplophragmoides_D1"
        },
        {
          "rule_key": "Haplophragmoides_S2"
        },
        {
          "rule_key": "Haplophragmoides_C2"
        },
        {
          "rule_key": "Recurvoides_M4"
        },
        {
          "rule_key": "Recurvoides_D1"
        },
        {
          "rule_key": "Recurvoides_D3"
        },
        {
          "rule_key": "Recurvoides_S1"
        },
        {
          "rule_key": "Ammobaculites_S2"
        },
        {
          "rule_key": "Reticulophragmium_D2"
        },
        {
          "rule_key": "Reticulophragmium_S1"
        },
        {
          "rule_key": "Trochammina_D2"
        },
        {
          "rule_key": "Trochammina_D3"
        },
        {
          "rule_key": "Trochammina_S1"
        },
        {
          "rule_key": "Trochammina_S2"
        },
        {
          "rule_key": "Rzehakina_M3"
        },
        {
          "rule_key": "Rzehakina_D3"
        },
        {
          "rule_key": "Rzehakina_S1"
        },
        {
          "rule_key": "Rzehakina_S2"
        },
        {
          "rule_key": "Textularia_D1"
        },
        {
          "rule_key": "Spiroplectammina_S2"
        },
        {
          "rule_key": "Spiroplectammina_C1"
        },
        {
          "rule_key": "Gaudryina_M3"
        },
        {
          "rule_key": "Gaudryina_D3"
        },
        {
          "rule_key": "Gaudryina_S2"
        },
        {
          "rule_key": "Dorothia_M3"
        },
        {
          "rule_key": "Dorothia_S1"
        },
        {
          "rule_key": "Dorothia_S2"
        },
        {
          "rule_key": "Clavulina_M3"
        },
        {
          "rule_key": "Karrerulina_M3"
        },
        {
          "rule_key": "Karrerulina_D2"
        },
        {
          "rule_key": "Karrerulina_S1"
        },
        {
          "rule_key": "Coskinolina_M2"
        },
        {
          "rule_key": "Coskinolina_M5"
        },
        {
          "rule_key": "Coskinolina_D2"
        },
        {
          "rule_key": "Coskinolina_S1"
        },
        {
          "rule_key": "Coskinolina_S2"
        },
        {
          "rule_key": "Coskinolina_C2"
        },
        {
          "rule_key": "Dictyoconus_D1"
        },
        {
          "rule_key": "Dictyoconus_D2"
        },
        {
          "rule_key": "Dictyoconus_S2"
        },
        {
          "rule_key": "Dictyoconus_C2"
        },
        {
          "rule_key": "Barattolites_M3"
        },
        {
          "rule_key": "Barattolites_S1"
        },
        {
          "rule_key": "Barattolites_C1"
        },
        {
          "rule_key": "Alveolina_D4"
        },
        {
          "rule_key": "Alveolina_S1"
        },
        {
          "rule_key": "Alveolina_S3"
        }
      ],
      "row_count": 213,
      "expected": [
        {
          "rule_key": "Ammodiscus_M4"
        },
        {
          "rule_key": "Ammodiscus_C3"
        },
        {
          "rule_key": "Glomospira_S1"
        },
        {
          "rule_key": "Saccammina_D2"
        },
        {
          "rule_key": "Saccammina_S1"
        },
        {
          "rule_key": "Saccammina_S2"
        },
        {
          "rule_key": "Saccammina_C3"
        },
        {
          "rule_key": "Psammosphaera_D1"
        },
        {
          "rule_key": "Psammosphaera_D2"
        },
        {
          "rule_key": "Psammosphaera_S1"
        },
        {
          "rule_key": "Psammosphaera_S2"
        },
        {
          "rule_key": "Psammosphaera_C1"
        },
        {
          "rule_key": "Bathysiphon_S2"
        },
        {
          "rule_key": "Bathysiphon_C3"
        },
        {
          "rule_key": "Rhabdammina_D1"
        },
        {
          "rule_key": "Rhabdammina_D2"
        },
        {
          "rule_key": "Rhizammina_D1"
        },
        {
          "rule_key": "Rhizammina_D2"
        },
        {
          "rule_key": "Rhizammina_S1"
        },
        {
          "rule_key": "Rhizammina_C2"
        },
        {
          "rule_key": "Rhizammina_C3"
        },
        {
          "rule_key": "Reophax_D2"
        },
        {
          "rule_key": "Reophax_D3"
        },
        {
          "rule_key": "Reophax_S1"
        },
        {
          "rule_key": "Hormosina_D2"
        },
        {
          "rule_key": "Hormosina_D3"
        },
        {
          "rule_key": "Hormosina_S1"
        },
        {
          "rule_key": "Hormosina_C1"
        },
        {
          "rule_key": "Haplophragmoides_D1"
        },
        {
          "rule_key": "Haplophragmoides_S2"
        },
        {
          "rule_key": "Haplophragmoides_C2"
        },
        {
          "rule_key": "Recurvoides_M4"
        },
        {
          "rule_key": "Recurvoides_D1"
        },
        {
          "rule_key": "Recurvoides_D3"
        },
        {
          "rule_key": "Recurvoides_S1"
        },
        {
          "rule_key": "Ammobaculites_S2"
        },
        {
          "rule_key": "Reticulophragmium_D2"
        },
        {
          "rule_key": "Reticulophragmium_S1"
        },
        {
          "rule_key": "Trochammina_D2"
        },
        {
          "rule_key": "Trochammina_D3"
        },
        {
          "rule_key": "Trochammina_S1"
        },
        {
          "rule_key": "Trochammina_S2"
        },
        {
          "rule_key": "Rzehakina_M3"
        },
        {
          "rule_key": "Rzehakina_D3"
        },
        {
          "rule_key": "Rzehakina_S1"
        },
        {
          "rule_key": "Rzehakina_S2"
        },
        {
          "rule_key": "Textularia_D1"
        },
        {
          "rule_key": "Spiroplectammina_S2"
        },
        {
          "rule_key": "Spiroplectammina_C1"
        },
        {
          "rule_key": "Gaudryina_M3"
        },
        {
          "rule_key": "Gaudryina_D3"
        },
        {
          "rule_key": "Gaudryina_S2"
        },
        {
          "rule_key": "Dorothia_M3"
        },
        {
          "rule_key": "Dorothia_S1"
        },
        {
          "rule_key": "Dorothia_S2"
        },
        {
          "rule_key": "Clavulina_M3"
        },
        {
          "rule_key": "Karrerulina_M3"
        },
        {
          "rule_key": "Karrerulina_D2"
        },
        {
          "rule_key": "Karrerulina_S1"
        },
        {
          "rule_key": "Coskinolina_M2"
        },
        {
          "rule_key": "Coskinolina_M5"
        },
        {
          "rule_key": "Coskinolina_D2"
        },
        {
          "rule_key": "Coskinolina_S1"
        },
        {
          "rule_key": "Coskinolina_S2"
        },
        {
          "rule_key": "Coskinolina_C2"
        },
        {
          "rule_key": "Dictyoconus_D1"
        },
        {
          "rule_key": "Dictyoconus_D2"
        },
        {
          "rule_key": "Dictyoconus_S2"
        },
        {
          "rule_key": "Dictyoconus_C2"
        },
        {
          "rule_key": "Barattolites_M3"
        },
        {
          "rule_key": "Barattolites_S1"
        },
        {
          "rule_key": "Barattolites_C1"
        },
        {
          "rule_key": "Alveolina_D4"
        },
        {
          "rule_key": "Alveolina_S1"
        },
        {
          "rule_key": "Alveolina_S3"
        },
        {
          "rule_key": "Alveolina_S4"
        },
        {
          "rule_key": "Glomalveolina_S1"
        },
        {
          "rule_key": "Glomalveolina_S3"
        },
        {
          "rule_key": "Borelis_D2"
        },
        {
          "rule_key": "Borelis_D3"
        },
        {
          "rule_key": "Borelis_S1"
        },
        {
          "rule_key": "Borelis_S3"
        },
        {
          "rule_key": "Quinqueloculina_M3"
        },
        {
          "rule_key": "Quinqueloculina_D1"
        },
        {
          "rule_key": "Quinqueloculina_S1"
        },
        {
          "rule_key": "Quinqueloculina_S2"
        },
        {
          "rule_key": "Hauerina_D1"
        },
        {
          "rule_key": "Hauerina_D2"
        },
        {
          "rule_key": "Hauerina_S2"
        },
        {
          "rule_key": "Hauerina_C1"
        },
        {
          "rule_key": "Hauerina_C2"
        },
        {
          "rule_key": "Articulina_C2"
        },
        {
          "rule_key": "Triloculina_D1"
        },
        {
          "rule_key": "Triloculina_D2"
        },
        {
          "rule_key": "Triloculina_S2"
        },
        {
          "rule_key": "Triloculina_C3"
        },
        {
          "rule_key": "Miliolinella_D2"
        },
        {
          "rule_key": "Miliolinella_S1"
        },
        {
          "rule_key": "Miliolinella_C1"
        },
        {
          "rule_key": "Miliolinella_C2"
        },
        {
          "rule_key": "Pyrgo_D1"
        },
        {
          "rule_key": "Pyrgo_S1"
        },
        {
          "rule_key": "Pyrgoina_D1"
        },
        {
          "rule_key": "Pyrgoina_S1"
        },
        {
          "rule_key": "Pyrgoina_S2"
        },
        {
          "rule_key": "Pyrgoina_C2"
        },
        {
          "rule_key": "Peneroplis_D2"
        },
        {
          "rule_key": "Peneroplis_D3"
        },
        {
          "rule_key": "Coscinospira_D1"
        },
        {
          "rule_key": "Dendritina_M3"
        },
        {
          "rule_key": "Dendritina_D1"
        },
        {
          "rule_key": "Dendritina_C1"
        },
        {
          "rule_key": "Vertebralina_C1"
        },
        {
          "rule_key": "Nubecularia_S1"
        },
        {
          "rule_key": "Fabularia_D1"
        },
        {
          "rule_key": "Fabularia_S2"
        },
        {
          "rule_key": "Fabularia_S3"
        },
        {
          "rule_key": "Lacazina_M3"
        },
        {
          "rule_key": "Lacazina_S2"
        },
        {
          "rule_key": "Lacazina_C1"
        },
        {
          "rule_key": "Lacazina_C2"
        },
        {
          "rule_key": "Pseudolacazina_D2"
        },
        {
          "rule_key": "Pseudolacazina_S1"
        },
        {
          "rule_key": "Pseudolacazina_S3"
        },
        {
          "rule_key": "Lacazinella_M4"
        },
        {
          "rule_key": "Lacazinella_D1"
        },
        {
          "rule_key": "Lacazinella_D2"
        },
        {
          "rule_key": "Lacazinella_D3"
        },
        {
          "rule_key": "Lacazinella_S2"
        },
        {
          "rule_key": "Lacazinella_C2"
        },
        {
          "rule_key": "Periloculina_D1"
        },
        {
          "rule_key": "Periloculina_D2"
        },
        {
          "rule_key": "Periloculina_S2"
        },
        {
          "rule_key": "Idalina_M4"
        },
        {
          "rule_key": "Idalina_D1"
        },
        {
          "rule_key": "Idalina_D3"
        },
        {
          "rule_key": "Idalina_S1"
        },
        {
          "rule_key": "Idalina_S2"
        },
        {
          "rule_key": "Nummulites_D3"
        },
        {
          "rule_key": "Nummulites_S2"
        },
        {
          "rule_key": "Nummulites_C3"
        },
        {
          "rule_key": "Assilina_D2"
        },
        {
          "rule_key": "Assilina_D3"
        },
        {
          "rule_key": "Assilina_C2"
        },
        {
          "rule_key": "Operculina_M3"
        },
        {
          "rule_key": "Operculina_D3"
        },
        {
          "rule_key": "Operculina_D4"
        },
        {
          "rule_key": "Ranikothalia_M3"
        },
        {
          "rule_key": "Ranikothalia_S1"
        },
        {
          "rule_key": "Heterostegina_M3"
        },
        {
          "rule_key": "Spiroclypeus_M3"
        },
        {
          "rule_key": "Spiroclypeus_D3"
        },
        {
          "rule_key": "Spiroclypeus_C1"
        },
        {
          "rule_key": "Lockhartia_D2"
        },
        {
          "rule_key": "Kathina_M3"
        },
        {
          "rule_key": "Kathina_D2"
        },
        {
          "rule_key": "Daviesina_D2"
        },
        {
          "rule_key": "Miscellanea_M2"
        },
        {
          "rule_key": "Miscellanea_D2"
        },
        {
          "rule_key": "Laffitteina_D1"
        },
        {
          "rule_key": "Laffitteina_D2"
        },
        {
          "rule_key": "Rotalia_D1"
        },
        {
          "rule_key": "Pararotalia_D1"
        },
        {
          "rule_key": "Cuvillierina_M3"
        },
        {
          "rule_key": "Cuvillierina_D1"
        },
        {
          "rule_key": "Ornatorotalia_D1"
        },
        {
          "rule_key": "Granorotalia_D1"
        },
        {
          "rule_key": "Granorotalia_D2"
        },
        {
          "rule_key": "Asterocyclina_M4"
        },
        {
          "rule_key": "Asterocyclina_D1"
        },
        {
          "rule_key": "Discocyclina_M4"
        },
        {
          "rule_key": "Discocyclina_M5"
        },
        {
          "rule_key": "Discocyclina_D2"
        },
        {
          "rule_key": "Orbitoclypeus_M4"
        },
        {
          "rule_key": "Orbitoclypeus_D1"
        },
        {
          "rule_key": "Orbitoclypeus_D2"
        },
        {
          "rule_key": "Orbitoclypeus_D3"
        },
        {
          "rule_key": "Nemkovella_D1"
        },
        {
          "rule_key": "Nemkovella_D2"
        },
        {
          "rule_key": "Nemkovella_D3"
        },
        {
          "rule_key": "Lenticulina_M4"
        },
        {
          "rule_key": "Lenticulina_D2"
        },
        {
          "rule_key": "Palaeonummulites_D2"
        },
        {
          "rule_key": "Palaeonummulites_D3"
        },
        {
          "rule_key": "Palaeonummulites_D4"
        },
        {
          "rule_key": "Palaeonummulites_S2"
        },
        {
          "rule_key": "Palaeonummulites_S4"
        },
        {
          "rule_key": "Palaeonummulites_C3"
        },
        {
          "rule_key": "Nummulitoides_D3"
        },
        {
          "rule_key": "Nummulitoides_D5"
        },
        {
          "rule_key": "Nummulitoides_S1"
        },
        {
          "rule_key": "Nummulitoides_S4"
        },
        {
          "rule_key": "Nummulitoides_C5"
        },
        {
          "rule_key": "Planocamerinoides_D1"
        },
        {
          "rule_key": "Planocamerinoides_D2"
        },
        {
          "rule_key": "Planocamerinoides_D3"
        },
        {
          "rule_key": "Planocamerinoides_D5"
        },
        {
          "rule_key": "Planocamerinoides_S1"
        },
        {
          "rule_key": "Planocamerinoides_S2"
        },
        {
          "rule_key": "Planocamerinoides_S5"
        },
        {
          "rule_key": "Planocamerinoides_C2"
        },
        {
          "rule_key": "Planocamerinoides_C4"
        },
        {
          "rule_key": "Chordoperculinoides_D2"
        },
        {
          "rule_key": "Chordoperculinoides_D3"
        },
        {
          "rule_key": "Chordoperculinoides_D4"
        },
        {
          "rule_key": "Chordoperculinoides_D5"
        },
        {
          "rule_key": "Chordoperculinoides_D6"
        },
        {
          "rule_key": "Chordoperculinoides_S1"
        },
        {
          "rule_key": "Chordoperculinoides_S3"
        },
        {
          "rule_key": "Chordoperculinoides_S4"
        },
        {
          "rule_key": "Chordoperculinoides_S5"
        },
        {
          "rule_key": "Chordoperculinoides_C3"
        },
        {
          "rule_key": "Chordoperculinoides_C5"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 94
    },
    {
      "id": "CQ8",
      "question": "Contradictory rules repeating a positive rule of g",
      "parameters": {
        "g": "Ammodiscus"
      },
      "query": "MATCH (g:Genus {name:$g})-[:HAS_RULE {level:'CONTRADICTORY'}]->()-[x:REFERS_TO]->(c)<-[y:REFERS_TO]-()<-[h:HAS_RULE]-(g) WHERE h.level<>'CONTRADICTORY' AND x.suggestedValue=y.suggestedValue RETURN g.name AS genus, c.id AS character",
      "returned": [],
      "row_count": 0,
      "expected": [],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 88
    },
    {
      "id": "CQ9",
      "question": "Genera marked for taxonomic review",
      "parameters": {},
      "query": "MATCH (g:Genus {taxonomicReviewRequired:true}) RETURN g.name AS genus",
      "returned": [
        {
          "genus": "Barattolites"
        }
      ],
      "row_count": 1,
      "expected": [
        {
          "genus": "Barattolites"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 98
    },
    {
      "id": "CQ10",
      "question": "Environmental or reference-species profiles linked to g",
      "parameters": {
        "g": "Alveolina"
      },
      "query": "MATCH (:Genus {name:$g})-[:HAS_REFERENCE_SPECIES|HAS_ENVIRONMENT_PROFILE]->(t:TaxonProfile) RETURN t.scientificName AS scientificName",
      "returned": [
        {
          "scientificName": "Alveolina haymanaensis"
        }
      ],
      "row_count": 1,
      "expected": [
        {
          "scientificName": "Alveolina haymanaensis"
        }
      ],
      "expected_basis": "Independent master JSON",
      "matches_expected": true,
      "elapsed_ms": 95
    }
  ]
}