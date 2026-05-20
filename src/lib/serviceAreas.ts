// Greater Boston service area ZIP codes
export const SERVICE_AREAS: { zip: string; city: string }[] = [
  // Boston neighborhoods
  { zip:"02101", city:"Boston" }, { zip:"02102", city:"Boston" }, { zip:"02103", city:"Boston" },
  { zip:"02104", city:"Boston" }, { zip:"02105", city:"Boston" }, { zip:"02106", city:"Boston" },
  { zip:"02107", city:"Boston" }, { zip:"02108", city:"Boston (Beacon Hill)" },
  { zip:"02109", city:"Boston (North End)" }, { zip:"02110", city:"Boston (Financial District)" },
  { zip:"02111", city:"Boston (Chinatown)" }, { zip:"02112", city:"Boston" },
  { zip:"02113", city:"Boston (North End)" }, { zip:"02114", city:"Boston (West End)" },
  { zip:"02115", city:"Boston (Fenway)" }, { zip:"02116", city:"Boston (Back Bay)" },
  { zip:"02117", city:"Boston" }, { zip:"02118", city:"Boston (South End)" },
  { zip:"02119", city:"Boston (Roxbury)" }, { zip:"02120", city:"Boston (Roxbury)" },
  { zip:"02121", city:"Boston (Dorchester)" }, { zip:"02122", city:"Boston (Dorchester)" },
  { zip:"02123", city:"Boston" }, { zip:"02124", city:"Boston (Dorchester)" },
  { zip:"02125", city:"Boston (Dorchester)" }, { zip:"02126", city:"Boston (Mattapan)" },
  { zip:"02127", city:"Boston (South Boston)" }, { zip:"02128", city:"Boston (East Boston)" },
  { zip:"02129", city:"Boston (Charlestown)" }, { zip:"02130", city:"Boston (Jamaica Plain)" },
  { zip:"02131", city:"Boston (Roslindale)" }, { zip:"02132", city:"Boston (West Roxbury)" },
  { zip:"02133", city:"Boston" }, { zip:"02134", city:"Boston (Allston)" },
  { zip:"02135", city:"Boston (Brighton)" }, { zip:"02136", city:"Boston (Hyde Park)" },
  { zip:"02137", city:"Boston" }, { zip:"02163", city:"Boston (Harvard Square)" },
  { zip:"02210", city:"Boston (Seaport)" }, { zip:"02215", city:"Boston (Kenmore)" },
  // Surrounding cities
  { zip:"02138", city:"Cambridge" }, { zip:"02139", city:"Cambridge" },
  { zip:"02140", city:"Cambridge" }, { zip:"02141", city:"Cambridge" }, { zip:"02142", city:"Cambridge" },
  { zip:"02143", city:"Somerville" }, { zip:"02144", city:"Somerville" }, { zip:"02145", city:"Somerville" },
  { zip:"02149", city:"Everett" }, { zip:"02150", city:"Chelsea" },
  { zip:"02151", city:"Revere" }, { zip:"02152", city:"Winthrop" },
  { zip:"02148", city:"Malden" }, { zip:"02155", city:"Medford" }, { zip:"02176", city:"Melrose" },
  { zip:"02180", city:"Stoneham" }, { zip:"02170", city:"Quincy" },
  { zip:"02169", city:"Quincy" }, { zip:"02171", city:"Quincy" },
  { zip:"02445", city:"Brookline" }, { zip:"02446", city:"Brookline" }, { zip:"02447", city:"Brookline" },
  { zip:"02458", city:"Newton" }, { zip:"02459", city:"Newton Centre" },
  { zip:"02460", city:"Newton" }, { zip:"02461", city:"Newton Highlands" },
  { zip:"02462", city:"Newton Lower Falls" }, { zip:"02464", city:"Newton Upper Falls" },
  { zip:"02465", city:"West Newton" }, { zip:"02466", city:"Auburndale" },
  { zip:"02467", city:"Chestnut Hill" }, { zip:"02468", city:"Waban" },
  { zip:"02472", city:"Watertown" },
  { zip:"02474", city:"Arlington" }, { zip:"02476", city:"Arlington" },
  { zip:"02478", city:"Belmont" }, { zip:"02479", city:"Belmont" },
  { zip:"02420", city:"Lexington" }, { zip:"02421", city:"Lexington" },
  { zip:"02451", city:"Waltham" }, { zip:"02452", city:"Waltham" },
  { zip:"02453", city:"Waltham" }, { zip:"02454", city:"Waltham" },
  { zip:"02026", city:"Dedham" }, { zip:"02062", city:"Norwood" },
  { zip:"02090", city:"Westwood" }, { zip:"02492", city:"Needham" }, { zip:"02494", city:"Needham" },
  { zip:"02481", city:"Wellesley" }, { zip:"02482", city:"Wellesley" },
  { zip:"02184", city:"Braintree" }, { zip:"02185", city:"Braintree" },
  { zip:"02186", city:"Milton" }, { zip:"02188", city:"Weymouth" }, { zip:"02189", city:"Weymouth" },
  { zip:"02021", city:"Canton" }, { zip:"02072", city:"Stoughton" }, { zip:"02368", city:"Randolph" },
  { zip:"01760", city:"Natick" }, { zip:"01701", city:"Framingham" }, { zip:"01702", city:"Framingham" },
  { zip:"01801", city:"Woburn" }, { zip:"01803", city:"Burlington" }, { zip:"01821", city:"Billerica" },
  { zip:"01880", city:"Wakefield" }, { zip:"01867", city:"Reading" }, { zip:"01887", city:"Wilmington" },
  { zip:"01907", city:"Swampscott" }, { zip:"01915", city:"Beverly" },
  { zip:"01945", city:"Marblehead" }, { zip:"01960", city:"Peabody" }, { zip:"01961", city:"Peabody" },
  { zip:"01970", city:"Salem" }, { zip:"01971", city:"Salem" },
  { zip:"01840", city:"Lawrence" }, { zip:"01841", city:"Lawrence" },
  { zip:"01843", city:"Lawrence" }, { zip:"01844", city:"Methuen" },
  { zip:"01850", city:"Lowell" }, { zip:"01851", city:"Lowell" },
  { zip:"01852", city:"Lowell" }, { zip:"01853", city:"Lowell" }, { zip:"01854", city:"Lowell" },
].sort((a, b) => a.zip.localeCompare(b.zip));

export function getCityByZip(zip: string): string {
  return SERVICE_AREAS.find(a => a.zip === zip)?.city ?? "";
}

export function isServiceableZip(zip: string): boolean {
  return SERVICE_AREAS.some(a => a.zip === zip);
}
