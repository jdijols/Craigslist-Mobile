import type { ListingData } from "../components/ui/cards/types";
import { haversineMiles, getListingCoords } from "../utils/geo";
import { DEFAULT_LOCATION } from "../contexts/LocationContext";

const PHOTOS: Record<string, string> = {
  // ── existing ──
  photography: "photo-1624873613044-be3c1de7f09a",
  chefs: "photo-1592498546551-222538011a27",
  massage: "photo-1737352777897-e22953991a32",
  tutoring: "photo-1758685733907-42e9651721f5",
  cleaning: "photo-1758272421516-9593de0fb5bf",
  moving: "photo-1770562525550-95705f7fb944",
  record: "photo-1616587998810-6e2a4a270866",
  bike: "photo-1767879624367-5b238127ec5d",
  boxes: "photo-1766040923580-16ad32fae8b4",
  patio: "photo-1769502963760-ea942f2d1fe7",
  dresser: "photo-1758443487060-460f8162c282",
  dresser2: "photo-1771039753570-b3a1ddf868ab",

  shelf: "photo-1697228427801-89a5768527f7",
  shelf2: "photo-1758598304204-5bec31342d05",
  shelf3: "photo-1758598304204-5bec31342d05",
  chair: "photo-1757194455393-8e3134d4ce19",
  chair2: "photo-1765765419166-3bf1af848951",
  chair3: "photo-1760611655987-d348d6d28174",
  chair4: "photo-1619607368387-e8d221c4459f",
  bed: "photo-1676152466751-054c5cb0af27",
  bed2: "photo-1771287491132-4954b32210d6",
  table: "photo-1672948657444-6bd7fbb29538",
  desk: "photo-1625655164399-6e7b172727d3",
  desk2: "photo-1639730515041-02332c35cdec",
  lamp: "photo-1696815096343-336a939e7d8f",
  lamp2: "photo-1747028009628-687f7fc0ab15",
  lamp3: "photo-1570974802254-4b0ad1a755f5",
  bookshelf: "photo-1761330439741-3dcf41ee766b",
  burnsville: "photo-1768941124460-6fa7161715ff",
  priorlake: "photo-1767948693674-e96ae5a755c9",
  lakeville: "photo-1730307816727-41479bf77db1",
  shakopee: "photo-1762810981576-1b07f76af9d2",
  room1: "photo-1661796428175-55423b19409f",
  room2: "photo-1744904998059-42485e16d688",
  room3: "photo-1652882861109-570be85c2b92",
  cabin: "photo-1765832656676-96294a88d919",
  bungalow: "photo-1719245528771-65da2b4e0e01",
  bungalow2: "photo-1737467026661-31b5a87098fe",
  bungalow3: "photo-1737467026661-31b5a87098fe",
  bungalow4: "photo-1696815115263-862b21c899b7",
  retail: "photo-1768576596074-bce66979cb0f",
  healthcare: "photo-1646082275130-347d10885c5f",
  restaurant: "photo-1622021142947-da7dedc7c39a",
  admin: "photo-1758611972678-bc3b29b4718f",
  delivery: "photo-1764792314927-a82d9996285f",
  free: "photo-1765000884289-baee6a441acd",
  artists: "photo-1759143102721-929f34e42a6a",
  sublets: "photo-1769184618473-58c1f0e294f4",
  labor: "photo-1620562378651-e610bf63da00",
  creative: "photo-1730206562928-0efd62560435",
  events: "photo-1770805001834-f9ccd734c6fb",
  computer: "photo-1544847558-3ccacb31ee7f",
  writing: "photo-1709039549249-dd25168a8e63",
  "walnut-table": "photo-1758373149416-f7dcd4505c72",
  "walnut-table2": "photo-1722226947444-ffcffa432f87",
  sofa: "photo-1758957701419-2c6e266f7988",
  sofa2: "photo-1759722667163-11b9a3544670",
  sofa3: "photo-1589999405517-d19e4c105649",
  standing: "photo-1696453424699-f6ebbe24c28a",
  officechair: "photo-1771573753453-70e26aa92246",
  monitor: "photo-1653823815301-faf2f30db0bd",
  keyboard: "photo-1546435770-a3e426bf472b",
  gaming: "photo-1608511271453-7b293dc27bce",
  organizer: "photo-1751107756602-dc1f003e50b5",
  cabinet: "photo-1621262402468-a1c27d6ba468",
  lshape: "photo-1648130062497-cd75a622a0c9",
  stand: "photo-1643185720431-9c050eebbc9a",
  mesh: "photo-1669985457873-0c540a1d832a",
  cable: "photo-1760348213270-7cd00b8c3405",
  converter: "photo-1696453424699-f6ebbe24c28a",
  printer: "photo-1750534232339-017655f56081",
  // ── for sale – phones ──
  iphone15: "photo-1736191550786-46a46aa47394",
  samsungs24: "photo-1729514552998-cdb2975826cf",
  pixel8: "photo-1598522017610-edbea54edd64",
  iphone14: "photo-1601993096415-a17a1fc233c0",
  galaxyflip: "photo-1582155783823-8f37f9bcd4ca",
  galaxys23: "photo-1721864428861-e4a9e9f9a5ee",
  // ── for sale – computer parts ──
  rtx4070: "photo-1578286788444-8c1487fcd823",
  mechkeyboard: "photo-1647180932449-75a35aee9577",
  ramsticks: "photo-1654240253461-3f51c793b366",
  // ── for sale – misc ──
  boardgames: "photo-1716817276042-21a922e2a8bc",
  puzzles: "photo-1758718035215-f76eb1bba569",
  hondacivic: "photo-1742230376664-ce990c7d7bb9",
  toyotacamry: "photo-1663530079695-f7bea03451bd",
  kitchenaid: "photo-1758565810987-ca8d617ea7be",
  coffeetable: "photo-1724026502211-ff953e813194",
  diningtable: "photo-1758977404607-9d6217cad08a",
  accentchair: "photo-1763771075381-4adb01e77a1d",
  nightstand: "photo-1597362171236-f4fa34e109ef",
  barcart: "photo-1638741279987-edcad3da1c67",
  futon: "photo-1698936061086-2bf99c7b9fc5",
  jewelry1: "photo-1758995115560-59c10d6cc28f",
  // ── jobs ──
  graphicdesigner: "photo-1682056598904-9aa7ea5e8991",
  uidesigner: "photo-1761122827167-159d1d272313",
  branddesigner: "photo-1764740109279-c7a8abd78821",
  creativedirector: "photo-1638275559239-82bfdb0d68c6",
  motiondesigner: "photo-1764312385768-93b8f47250de",
  artdirector: "photo-1572018098513-8c5fa9a254cc",
  seniordesigner: "photo-1623932078839-44eb01fbee63",
  frontenddev: "photo-1656680632373-e2aec264296b",
  webdesigner: "photo-1761122827167-159d1d272313",
  wordpressdev: "photo-1678341859828-bfb1a2bd527a",
  uxresearcher: "photo-1765438863789-1396d28db24b",
  fullstackdev: "photo-1753998943228-73470750c597",
  qaengineer: "photo-1701691282435-c54d51e501b4",
  dataanalyst: "photo-1551288049-bebda4e38f71",
  devops: "photo-1510182760-5565485cf674",
  linecook: "photo-1766232315004-25980447bb19",
  barista: "photo-1655655555559-70610bfe5598",
  serverstaff: "photo-1544986581-efac024faf62",
  restaurantmgr: "photo-1759277531767-b82c1028bf7d",
  foodrunner: "photo-1765966871032-7fe67d208761",
  // ── housing ──
  studio_apt: "photo-1770706240556-2437e34b0461",
  apt_1br: "photo-1649083048239-c05841380582",
  apt_2br: "photo-1612419299101-6c294dc2901d",
  apt_3br: "photo-1768548273807-275b0e16fff3",
  luxury_condo: "photo-1638454668466-e8dbd5462f20",
  warehouse_loft: "photo-1758887250669-9ce43c44611d",
  apt_dinkytown: "photo-1769068653040-eb7f35166901",
  apt_city: "photo-1642651084466-95ecf2f8f367",
  apt_lake: "photo-1740118511910-ca8551c3a857",
  house_lake: "photo-1762979790868-3bf9153b84cc",
  townhouse_mod: "photo-1767948693674-e96ae5a755c9",
  colonial_house: "photo-1762995349592-06469ef1920c",
  rambler_house: "photo-1672925645501-9d66ce4d9cdf",
  shared_room: "photo-1648634158203-199accfd7afc",
  private_room: "photo-1769063238167-d00e112147c0",
  room_for_rent: "photo-1709544345907-ceea96cb69c2",
  // ── housing interiors ──
  kitchen_modern: "photo-1556909114-f6e7ad7d3136",
  kitchen_white: "photo-1484154218962-a197022b5858",
  kitchen_island: "photo-1600585154526-990dced4db0d",
  kitchen_dark: "photo-1600489000022-c2086d79f9d4",
  bathroom_tile: "photo-1552321554-5fefe8c9ef14",
  bathroom_lux: "photo-1507652313519-d4e9174996dd",
  bathroom_vanity: "photo-1600566753190-17f0baa2a6c3",
  bedroom_bright: "photo-1616594039964-ae9021a400a0",
  bedroom_cozy: "photo-1560185007-cde436f6a4d0",
  bedroom_minimal: "photo-1560448204-61dc36dc98c8",
  bedroom_master: "photo-1560185893-a55cbc8c57e8",
  livingroom_open: "photo-1618221195710-dd6b41faaea6",
  livingroom_loft: "photo-1502672260266-1c1ef2d93688",
  livingroom_warm: "photo-1600210492486-724fe5c67fb0",
  livingroom_bright: "photo-1600607687939-ce8a6c25118c",
  balcony_view: "photo-1600585154340-be6161a56a0c",
  balcony_city: "photo-1600573472592-401b489a3cdc",
  hallway_apt: "photo-1560448204-e02f11c3d0e2",
  entryway: "photo-1560440021-33f9b867899d",
  dining_area: "photo-1617806118233-18e1de247200",
  dining_open: "photo-1600585153490-76fb20a32601",
  laundry_room: "photo-1626806819282-2c1dc01a5e0c",
  closet_walkin: "photo-1560184897-ae75f418493e",
  sunroom: "photo-1600585152220-90363fe7e115",
  yard_fence: "photo-1564013799919-ab600027ffc6",
  patio_outdoor: "photo-1600585154363-67eb9e2e2099",
  porch_front: "photo-1600596542815-ffad4c1539a9",
  exterior_night: "photo-1600047509807-ba8f99d2cdde",
  garage_2car: "photo-1558036117-15d82a90b9b1",
  pool_backyard: "photo-1600607688969-a5bfcd646154",
  staircase: "photo-1600573472591-ee6b68d14c68",
  fireplace: "photo-1600121848594-d8644e57abab",
  office_home: "photo-1585128792020-803d29415281",
  mudroom: "photo-1600607687920-4e2a09cf159d",
  window_seat: "photo-1600566752355-35792bedcfea",
  // ── services ──
  design_svc: "photo-1508965493703-4823ac484045",
  video_svc: "photo-1639701386739-449a0e789367",
  illustration_svc: "photo-1624258395756-c7efa8c9c111",
  phone_repair: "photo-1746005718004-1f992c399428",
  screen_replace: "photo-1636589150123-6d57c10527ce",
  property_mgmt: "photo-1560518883-ce09059eeffa",
  realestate_svc: "photo-1729855637715-99192904aac5",
  copywriting_svc: "photo-1647086981666-c736e3c44914",
  resume_svc: "photo-1634562876572-5abe57afcceb",
  translation_svc: "photo-1673515335152-f2589ba8bb7a",
  // ── gigs ──
  logo_gig: "photo-1524642176501-f3393ec0b116",
  event_photo: "photo-1549622928-9d07306352d7",
  branding_gig: "photo-1666986527833-7ac743f9d243",
  website_gig: "photo-1706700392626-5279fb90ae73",
  wp_migration: "photo-1637937459053-c788742455be",
  app_dev_gig: "photo-1762341119237-98df67c9c3c9",
  blog_writer: "photo-1748209252552-30cf9cd32909",
  product_writer: "photo-1661956601349-f61c959a8fd4",
  // ── community ──
  lost_keys: "photo-1760348213270-7cd00b8c3405",
  found_bike: "photo-1767879624367-5b238127ec5d",
  community_event: "photo-1770805001834-f9ccd734c6fb",
};

const img = (seed: string, w = 400) =>
  `https://images.unsplash.com/${PHOTOS[seed] ?? seed}?w=${w}&h=${w}&fit=crop&auto=format&q=80`;

// ═══════════════════════════════════════════════════════════════════════════
// CURATED HOME FEED SECTIONS
// ═══════════════════════════════════════════════════════════════════════════

// ── Services (MicroCard) – placeholder; populated after category listings ────
let servicesMicro: ListingData[];

// ── Popular items in Hennepin Co ────────────────────────────────────────────
export const popularItemsHennepin: ListingData[] = [
  { id: "hen-1", price: "$80", title: "record player", hood: "edina", dist: "7.3 mi", time: "1h", image: img("record"), category: "for-sale" },
  { id: "hen-2", price: "$200", title: "cannondale synapse 56cm. carbon, shimano 105, barely ridden", hood: "st. louis park", dist: "4.8 mi", time: "3h", image: img("bike"), category: "for-sale" },
  { id: "hen-3", price: "Free", title: "free moving boxes! like 20+ of them, various sizes, come get em", hood: "hopkins", dist: "12.1 mi", time: "5h", image: img("boxes"), category: "for-sale" },
  { id: "hen-4", price: "$350", title: "patio set", hood: "hastings", dist: "26 mi", time: "2h", image: img("patio"), category: "for-sale" },
];

// ── Available jobs (MediumCard) – placeholder; populated after category listings
let jobsRamsey: ListingData[];

// ── homes for rent in dakota/scott ──────────────────────────────────────────
export const homesDakotaScott: ListingData[] = [
  { id: "dak-1", title: "3br burnsville. new kitchen, laundry in unit, available april", price: "$1,650/mo", image: img("burnsville"), images: [img("burnsville"), img("kitchen_island"), img("bedroom_master"), img("bathroom_vanity"), img("laundry_room")], badge: "just listed", rating: 4.9, category: "housing" },
  { id: "dak-2", title: "prior lake townhouse", price: "$1,895/mo", image: img("priorlake"), images: [img("priorlake"), img("livingroom_warm"), img("kitchen_dark"), img("bedroom_minimal"), img("staircase")], rating: 4.85, category: "housing" },
  { id: "dak-3", title: "2br lakeville condo – pets welcome!!", price: "$1,425/mo", image: img("lakeville"), images: [img("lakeville"), img("livingroom_bright"), img("kitchen_white"), img("bedroom_cozy"), img("balcony_city")], badge: "pet friendly", rating: 4.92, category: "housing" },
  { id: "dak-4", title: "4br shakopee, fenced yard", price: "$2,100/mo", image: img("shakopee"), images: [img("shakopee"), img("kitchen_modern"), img("fireplace"), img("bedroom_bright"), img("yard_fence"), img("garage_2car")], rating: 4.88, category: "housing" },
];

// ── Popular For-Sale ────────────────────────────────────────────────────────
export const popularForSale: ListingData[] = [
  { id: "pop-1", price: "$275", title: "mid-century dresser, walnut, 6 drawers. solid condition", hood: "uptown", dist: "3.8 mi", time: "2h", image: img("dresser"), images: [img("dresser"), img("dresser2")], category: "for-sale" },
  { id: "pop-2", price: "$649", title: "iphone 15 pro 256gb", hood: "downtown", dist: "1.4 mi", time: "1h", image: img("iphone15"), category: "for-sale" },
  { id: "pop-3", price: "$550", title: "herman miller aeron – size B, lumbar, like new", hood: "northeast", dist: "9.8 mi", time: "7h", image: img("chair"), images: [img("chair"), img("chair2"), img("chair3"), img("chair4")], category: "for-sale" },
  { id: "pop-4", price: "$120", title: "queen platform bed w headboard", hood: "dinkytown", dist: "4.2 mi", time: "3h", image: img("bed"), images: [img("bed"), img("bed2")], category: "for-sale" },
];

// ── Housing (MediumCard scroll row) ─────────────────────────────────────────
export const housingMedium: ListingData[] = [
  { id: "hsg-1", title: "1br northeast arts district – hardwood, walk to everything", price: "$1,350/mo", image: img("room1"), images: [img("room1"), img("kitchen_dark"), img("bathroom_lux"), img("entryway")], badge: "top rated", rating: 4.96, category: "housing" },
  { id: "hsg-2", title: "downtown loft", price: "$1,800/mo", image: img("room2"), images: [img("room2"), img("livingroom_loft"), img("kitchen_island"), img("balcony_city"), img("window_seat")], badge: "guest favorite", rating: 5.0, category: "housing" },
  { id: "hsg-3", title: "studio by u of m. small but perfect for student. available now", price: "$925/mo", image: img("room3"), images: [img("room3"), img("kitchen_white"), img("bathroom_tile"), img("closet_walkin")], rating: 4.87, category: "housing" },
  { id: "hsg-4", title: "lake cabin – sleeps 6, dock, fire pit, amazing sunsets", price: "$210/night", image: img("cabin"), images: [img("cabin"), img("fireplace"), img("bedroom_cozy"), img("sunroom"), img("porch_front")], badge: "guest favorite", rating: 4.93, category: "housing" },
];

// ── Featured Post (GalleryCard) ─────────────────────────────────────────────
export const featuredGallery: ListingData = {
  id: "feat-1",
  title: "craftsman bungalow – original woodwork, new kitchen, must see",
  subtitle: "3BR/2BA · original woodwork, updated kitchen",
  details: ["3 beds", "available apr 1"],
  price: "$1,850",
  priceNote: "per month",
  image: img("bungalow", 800),
  images: [img("bungalow", 800), img("bungalow2", 800), img("bungalow3", 800), img("bungalow4", 800)],
  ratingLabel: "new",
  category: "housing",
};

// ── Community Spotlight (SlideCard) – placeholder; populated after category listings
let communitySlides: ListingData[];

// ── Gig Opportunities (MicroCard) – placeholder; populated after category listings
let gigsMicro: ListingData[];

// ── Trending Furniture ──────────────────────────────────────────────────────
export const trendingFurniture: ListingData[] = [
  { id: "fur-1", price: "Free", title: "free end table (minor scratches)", hood: "dinkytown", dist: "5.3 mi", time: "1d", image: img("table"), images: [img("table"), img("nightstand"), img("barcart")], category: "for-sale" },
  { id: "fur-2", price: "$85", title: "walnut desk", hood: "northeast", dist: "2.9 mi", time: "5h", image: img("desk"), images: [img("desk"), img("desk2")], category: "for-sale" },
  { id: "fur-3", price: "$35", title: "brass lamp – vintage, frosted shade, works great", hood: "uptown", dist: "4.1 mi", time: "8h", image: img("lamp"), images: [img("lamp"), img("lamp2"), img("lamp3")], category: "for-sale" },
  { id: "fur-4", price: "$190", title: "6ft oak bookshelf. 5 shelves. sturdy.", hood: "st. paul", dist: "15.3 mi", time: "12h", image: img("bookshelf"), images: [img("bookshelf"), img("shelf"), img("shelf2")], category: "for-sale" },
];

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY BROWSE LISTINGS (84 total)
// ═══════════════════════════════════════════════════════════════════════════

// ── For Sale (30) ───────────────────────────────────────────────────────────
export const forSaleListings: ListingData[] = [
  // furniture (14)
  { id: "fs-1", price: "$275", title: "mid-century dresser. walnut, 6 drawers, dovetail. cash only", hood: "uptown", dist: "3.8 mi", time: "2h", image: img("dresser"), images: [img("dresser"), img("dresser2")], category: "for-sale", subcategory: "furniture", attributes: { make_and_model: "mid-century dresser, walnut", condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-2", price: "$375", title: "dining table w hairpin legs – seats 6", hood: "powderhorn", dist: "1.2 mi", time: "45m", image: img("walnut-table"), images: [img("walnut-table"), img("walnut-table2")], category: "for-sale", subcategory: "furniture", attributes: { make_and_model: "hairpin legs dining table", condition: "good", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-3", price: "$225", title: "farmhouse table + 4 chairs. pine. great for family dinners!", hood: "uptown", dist: "7.4 mi", time: "5h", image: img("diningtable"), images: [img("diningtable"), img("dining_area"), img("dining_open")], category: "for-sale", subcategory: "furniture", attributes: { condition: "good", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-4", price: "$120", title: "queen bed frame", hood: "dinkytown", dist: "2.1 mi", time: "3h", image: img("bed"), images: [img("bed"), img("bed2")], category: "for-sale", subcategory: "furniture", attributes: { condition: "fair", posted_today: true, delivery_available: false, language_of_posting: "english" } },
  { id: "fs-5", price: "$550", title: "herman miller aeron – size B, lumbar, fully loaded. wfh upgrade", hood: "northeast", dist: "12.3 mi", time: "7h", image: img("chair"), images: [img("chair"), img("chair2"), img("chair3"), img("chair4")], badge: "nearby", category: "for-sale", subcategory: "furniture", attributes: { make_and_model: "herman miller aeron size B", condition: "like new", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-6", price: "$190", title: "oak bookshelf 6ft – 5 adjustable shelves, holds a ton of books", hood: "st. paul", dist: "15.6 mi", time: "12h", image: img("bookshelf"), images: [img("bookshelf"), img("shelf"), img("shelf2")], category: "for-sale", subcategory: "furniture", attributes: { condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-7", price: "$85", title: "small walnut desk – 2 drawers, fits in corner", hood: "northeast", dist: "4.7 mi", time: "5h", image: img("desk"), images: [img("desk"), img("desk2")], category: "for-sale", subcategory: "furniture", attributes: { condition: "good", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-8", price: "$200", title: "L-shaped sectional. gray. stain resistant. had it 6 months, upgrading", hood: "downtown", dist: "1.8 mi", time: "1h", image: img("sofa"), images: [img("sofa"), img("sofa2"), img("sofa3")], category: "for-sale", subcategory: "furniture", attributes: { condition: "like new", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-9", price: "$145", title: "surfboard coffee table – mid century, tapered legs", hood: "linden hills", dist: "9.1 mi", time: "1d", image: img("coffeetable"), images: [img("coffeetable"), img("livingroom_warm"), img("livingroom_open")], category: "for-sale", subcategory: "furniture", attributes: { condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-10", price: "Free", title: "end table (free) – some wear but solid", hood: "dinkytown", dist: "5.3 mi", time: "1d", image: img("table"), images: [img("table"), img("nightstand"), img("barcart")], category: "for-sale", subcategory: "furniture", attributes: { condition: "fair", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-11", price: "$35", title: "brass lamp 22in – frosted shade, vintage look", hood: "uptown", dist: "2.6 mi", time: "8h", image: img("lamp"), images: [img("lamp"), img("lamp2"), img("lamp3")], badge: "price drop", originalPrice: "$55", category: "for-sale", subcategory: "furniture", attributes: { condition: "good", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-12", price: "$180", title: "electric standing desk – 48in bamboo top, barely used", hood: "st. paul", dist: "14.2 mi", time: "5h", image: img("standing"), images: [img("standing"), img("desk"), img("officechair"), img("monitor")], category: "for-sale", subcategory: "furniture", attributes: { condition: "like new", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-13", price: "$45", title: "ikea kallax 4x4 white + bins", hood: "northeast", dist: "6.8 mi", time: "4h", image: img("shelf"), images: [img("shelf"), img("shelf2"), img("shelf3")], badge: "just listed", category: "for-sale", subcategory: "furniture", attributes: { make_and_model: "ikea kallax", condition: "good", posted_today: true, delivery_available: false, language_of_posting: "english" } },
  { id: "fs-14", price: "$195", title: "velvet accent chair – emerald green, gold legs, tufted. like new!!", hood: "uptown", dist: "8.5 mi", time: "1d", image: img("accentchair"), images: [img("accentchair"), img("chair"), img("livingroom_warm")], category: "for-sale", subcategory: "furniture", attributes: { condition: "like new", delivery_available: true, language_of_posting: "english" } },
  // cell phones (6)
  { id: "fs-15", price: "$649", title: "iphone 15 pro 256gb natural titanium – unlocked, mint condition", hood: "downtown", dist: "1.4 mi", time: "1h", image: img("iphone15"), badge: "just listed", category: "for-sale", subcategory: "cell phones", attributes: { make_and_model: "iphone 15 pro 256gb", condition: "like new", posted_today: true, delivery_available: false, cryptocurrency_ok: true, language_of_posting: "english" } },
  { id: "fs-16", price: "$529", title: "s24 128gb black", hood: "northeast", dist: "11.7 mi", time: "4h", image: img("samsungs24"), category: "for-sale", subcategory: "cell phones", attributes: { make_and_model: "samsung s24 128gb", condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-17", price: "$375", title: "pixel 8 – camera is amazing, selling bc switched to iphone", hood: "uptown", dist: "3.2 mi", time: "6h", image: img("pixel8"), category: "for-sale", subcategory: "cell phones", attributes: { make_and_model: "google pixel 8", condition: "good", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-18", price: "$310", title: "iphone 14 refurb 128gb – battery at 94%, works perfect", hood: "st. cloud", dist: "60 mi", time: "3h", image: img("iphone14"), category: "for-sale", subcategory: "cell phones", attributes: { make_and_model: "iphone 14 128gb", condition: "good", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-19", price: "$599", title: "galaxy z flip 5. 256gb. barely used, have box", hood: "downtown", dist: "2.9 mi", time: "2h", image: img("galaxyflip"), category: "for-sale", subcategory: "cell phones", attributes: { make_and_model: "samsung galaxy z flip 5", condition: "like new", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-20", price: "$280", title: "samsung s23 phantom blue 128gb unlocked", hood: "como", dist: "6.1 mi", time: "8h", image: img("galaxys23"), category: "for-sale", subcategory: "cell phones", attributes: { make_and_model: "samsung s23 128gb", condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  // computer parts (3)
  { id: "fs-21", price: "$420", title: "rtx 4070 asus dual – gaming only, never mined, 6mo old", hood: "northeast", dist: "10.4 mi", time: "5h", image: img("rtx4070"), category: "for-sale", subcategory: "computer parts", attributes: { make_and_model: "asus rtx 4070 dual", condition: "excellent", delivery_available: true, language_of_posting: "english" } },
  { id: "fs-22", price: "$85", title: "mech keyboard – mx brown, rgb, hot swap, tkl layout", hood: "marcy-holmes", dist: "4.3 mi", time: "4h", image: img("mechkeyboard"), category: "for-sale", subcategory: "computer parts", attributes: { condition: "good", delivery_available: false, cryptocurrency_ok: true, language_of_posting: "english" } },
  { id: "fs-23", price: "$55", title: "32gb ddr5 5600 – 2x16, nib", hood: "downtown", dist: "7.9 mi", time: "9h", image: img("ramsticks"), category: "for-sale", subcategory: "computer parts", attributes: { make_and_model: "ddr5 5600 32gb", condition: "new", delivery_available: true, language_of_posting: "english" } },
  // toys & games (2)
  { id: "fs-24", price: "$60", title: "board games – catan, ticket to ride, pandemic, 7 wonders, all complete", hood: "dinkytown", dist: "13.5 mi", time: "6h", image: img("boardgames"), category: "for-sale", subcategory: "toys & games", attributes: { condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-25", price: "$25", title: "8 puzzles", hood: "woodbury", dist: "15 mi", time: "1d", image: img("puzzles"), category: "for-sale", subcategory: "toys & games", attributes: { condition: "good", delivery_available: false, language_of_posting: "english" } },
  // cars & trucks (2)
  { id: "fs-26", price: "$8,500", title: "2018 civic lx – 62k miles, clean title, new tires last month", hood: "northfield", dist: "36 mi", time: "2h", image: img("hondacivic"), category: "for-sale", subcategory: "cars & trucks", attributes: { make_and_model: "2018 honda civic lx", condition: "good", delivery_available: false, language_of_posting: "english" } },
  { id: "fs-27", price: "$12,900", title: "camry se 2020. one owner. full dealer history. 41k.", hood: "chaska", dist: "21 mi", time: "4h", image: img("toyotacamry"), category: "for-sale", subcategory: "cars & trucks", attributes: { make_and_model: "2020 toyota camry se", condition: "excellent", delivery_available: false, language_of_posting: "english" } },
  // household (1)
  { id: "fs-28", price: "$180", title: "kitchenaid 5qt red – comes with all the attachments, used maybe 5x", hood: "linden hills", dist: "11.2 mi", time: "3h", image: img("kitchenaid"), category: "for-sale", subcategory: "household items", attributes: { make_and_model: "kitchenaid 5qt artisan", condition: "like new", delivery_available: true, language_of_posting: "english" } },
  // jewelry (1)
  { id: "fs-29", price: "$95", title: "14k gold pendant w 18in chain – gift box", hood: "uptown", dist: "5.8 mi", time: "7h", image: img("jewelry1"), category: "for-sale", subcategory: "jewelry", attributes: { condition: "excellent", delivery_available: true, language_of_posting: "english" } },
  // furniture misc (1)
  { id: "fs-30", price: "$130", title: "futon – gray, converts to bed, wood frame. 6mo old", hood: "dinkytown", dist: "8.3 mi", time: "6h", image: img("futon"), images: [img("futon"), img("bedroom_cozy"), img("livingroom_warm")], category: "for-sale", subcategory: "furniture", attributes: { condition: "like new", delivery_available: true, language_of_posting: "english" } },
  // free stuff (1)
  { id: "fs-31", price: "Free", title: "free boxes!!! moving, have way too many, all sizes", hood: "northeast", dist: "4.2 mi", time: "2h", image: img("boxes"), category: "for-sale", subcategory: "free stuff", attributes: { condition: "fair", posted_today: true, delivery_available: false, language_of_posting: "english" } },
];

// ── Jobs (20) ───────────────────────────────────────────────────────────────
export const jobListings: ListingData[] = [
  // art/media/design (7)
  { id: "jb-1", price: "$55k–$75k", title: "graphic designer", hood: "downtown", dist: "3.4 mi", time: "3h", image: img("graphicdesigner"), category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time" } },
  { id: "jb-2", price: "$70k–$95k", title: "ui/ux designer – product team, hybrid, figma + user research exp", hood: "northeast", dist: "1.7 mi", time: "1h", image: img("uidesigner"), badge: "just listed", category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time", telecommuting_ok: true, posted_today: true } },
  { id: "jb-3", price: "$60k–$80k", title: "brand designer – in-house creative, identity + systems", hood: "downtown", dist: "2.3 mi", time: "5h", image: img("branddesigner"), category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time" } },
  { id: "jb-4", price: "$90k–$120k", title: "creative director – lead team of 6, strategy + hands-on", hood: "north loop", dist: "8.6 mi", time: "2d", image: img("creativedirector"), category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time" } },
  { id: "jb-5", price: "$65k–$85k", title: "motion designer (AE + C4D)", hood: "downtown", dist: "5.1 mi", time: "8h", image: img("motiondesigner"), category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time", internship: true } },
  { id: "jb-6", price: "$80k–$110k", title: "art director – print & digital, manage juniors, fast-paced agency", hood: "uptown", dist: "6.9 mi", time: "1d", image: img("artdirector"), category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time" } },
  { id: "jb-7", price: "$60k–$80k", title: "senior designer – brand campaigns, marketing team", hood: "st. paul", dist: "14.8 mi", time: "4h", image: img("seniordesigner"), category: "jobs", subcategory: "art/media/design", attributes: { employment_type: "full-time" } },
  // web/html/info design (4)
  { id: "jb-8", price: "$75k–$100k", title: "frontend dev – react/ts, remote ok", hood: "downtown", dist: "4.2 mi", time: "6h", image: img("frontenddev"), category: "jobs", subcategory: "web/html/info design", attributes: { employment_type: "full-time", telecommuting_ok: true } },
  { id: "jb-9", price: "$55k–$70k", title: "web designer – wp, shopify, small biz. flexible", hood: "uptown", dist: "7.5 mi", time: "2h", image: img("webdesigner"), category: "jobs", subcategory: "web/html/info design", attributes: { employment_type: "employee's choice" } },
  { id: "jb-10", price: "$50k–$65k", title: "wordpress developer – themes, plugins. pt or ft", hood: "northeast", dist: "12.1 mi", time: "1d", image: img("wordpressdev"), category: "jobs", subcategory: "web/html/info design", attributes: { employment_type: "employee's choice" } },
  { id: "jb-11", price: "$70k–$90k", title: "ux researcher – interviews, usability, analytics. great team!", hood: "downtown", dist: "2.8 mi", time: "3h", image: img("uxresearcher"), category: "jobs", subcategory: "web/html/info design", attributes: { employment_type: "full-time", non_profit_organization: true } },
  // software/qa/dba (4)
  { id: "jb-12", price: "$85k–$120k", title: "full-stack – node + react. startup. equity. north loop.", hood: "north loop", dist: "1.1 mi", time: "5h", image: img("fullstackdev"), badge: "nearby", category: "jobs", subcategory: "software/qa/dba/etc", attributes: { employment_type: "full-time" } },
  { id: "jb-13", price: "$65k–$85k", title: "qa engineer – selenium, automation, ci/cd", hood: "red wing", dist: "46 mi", time: "1d", image: img("qaengineer"), category: "jobs", subcategory: "software/qa/dba/etc", attributes: { employment_type: "full-time" } },
  { id: "jb-14", price: "$70k–$95k", title: "data analyst – sql python tableau. healthcare. hybrid.", hood: "st. paul", dist: "15.3 mi", time: "8h", image: img("dataanalyst"), category: "jobs", subcategory: "software/qa/dba/etc", attributes: { employment_type: "full-time", telecommuting_ok: true } },
  { id: "jb-15", price: "$90k–$130k", title: "devops – aws, terraform, k8s. 100% remote", hood: "north loop", dist: "3.6 mi", time: "2h", image: img("devops"), category: "jobs", subcategory: "software/qa/dba/etc", attributes: { employment_type: "full-time", telecommuting_ok: true } },
  // food/bev/hospitality (5)
  { id: "jb-16", price: "$18–$22/hr", title: "line cook – dinner service, upscale casual. exp req", hood: "uptown", dist: "3.9 mi", time: "4h", image: img("linecook"), category: "jobs", subcategory: "food/beverage/hospitality", attributes: { employment_type: "full-time" } },
  { id: "jb-17", price: "$16–$19/hr", title: "barista – specialty coffee, latte art a plus!!", hood: "northeast", dist: "6.4 mi", time: "1h", image: img("barista"), badge: "just listed", category: "jobs", subcategory: "food/beverage/hospitality", attributes: { employment_type: "part-time", posted_today: true } },
  { id: "jb-18", price: "$15/hr + tips", title: "server – fine dining. weekends. wine knowledge helpful", hood: "downtown", dist: "2.1 mi", time: "6h", image: img("serverstaff"), category: "jobs", subcategory: "food/beverage/hospitality", attributes: { employment_type: "part-time" } },
  { id: "jb-19", price: "$55k–$65k", title: "restaurant manager", hood: "stillwater", dist: "23 mi", time: "2d", image: img("restaurantmgr"), category: "jobs", subcategory: "food/beverage/hospitality", attributes: { employment_type: "full-time" } },
  { id: "jb-20", price: "$15–$17/hr", title: "kitchen prep – morning shift, fast paced, dinkytown", hood: "dinkytown", dist: "9.3 mi", time: "3h", image: img("foodrunner"), category: "jobs", subcategory: "food/beverage/hospitality", attributes: { employment_type: "part-time" } },
];

// ── Housing (16) ────────────────────────────────────────────────────────────
export const housingListings: ListingData[] = [
  // apartments / housing for rent (9)
  { id: "hs-1", price: "$1,050/mo", title: "downtown studio – rooftop, modern", hood: "downtown", dist: "1.6 mi", time: "3h", image: img("studio_apt"), images: [img("studio_apt"), img("kitchen_modern"), img("bathroom_lux"), img("balcony_view")], badge: "just listed", rating: 4.8, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 0, bathrooms: 1, area: "550 ft²", rent_period: "monthly", move_in_date: "4/1/2026", availability: "within_30_days", housing_type: "apartment", laundry: "laundry in bldg", parking: "off-street parking", cats_ok: true, dogs_ok: false, no_smoking: true, air_conditioning: true, no_application_fee: true, posted_today: true } },
  { id: "hs-2", price: "$1,350/mo", title: "1br uptown. hardwood. walk to lakes. cats ok!", hood: "uptown", dist: "4.5 mi", time: "5h", image: img("apt_1br"), images: [img("apt_1br"), img("livingroom_warm"), img("bedroom_bright"), img("kitchen_island"), img("window_seat")], rating: 4.92, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 1, bathrooms: 1, area: "650 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "apartment", laundry: "laundry on site", parking: "off-street parking", cats_ok: true, dogs_ok: false, no_smoking: true, air_conditioning: true } },
  { id: "hs-3", price: "$1,600/mo", title: "2br northeast – exposed brick, laundry in unit, pet friendly", hood: "northeast", dist: "3.2 mi", time: "1h", image: img("apt_2br"), images: [img("apt_2br"), img("livingroom_loft"), img("kitchen_dark"), img("bedroom_master"), img("laundry_room")], badge: "pet friendly", rating: 4.96, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 2, bathrooms: 1, area: "950 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "apartment", laundry: "w/d in unit", parking: "off-street parking", cats_ok: true, dogs_ok: true, no_smoking: true, air_conditioning: true, no_broker_fee: true } },
  { id: "hs-4", price: "$1,950/mo", title: "3br st paul – new kitchen, garage, light rail 2 blocks", hood: "st. paul", dist: "13.4 mi", time: "8h", image: img("apt_3br"), images: [img("apt_3br"), img("kitchen_white"), img("bedroom_minimal"), img("bathroom_vanity"), img("garage_2car")], rating: 4.85, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 3, bathrooms: 2, area: "1250 ft²", rent_period: "monthly", move_in_date: "3/15/2026", availability: "within_30_days", housing_type: "apartment", laundry: "w/d in unit", parking: "attached garage", cats_ok: true, dogs_ok: true, no_smoking: true, air_conditioning: true } },
  { id: "hs-5", price: "$2,400/mo", title: "luxury 2br/2ba – concierge, gym, downtown views", hood: "downtown", dist: "2.7 mi", time: "2h", image: img("luxury_condo"), images: [img("luxury_condo"), img("livingroom_bright"), img("kitchen_modern"), img("bathroom_lux"), img("balcony_city"), img("closet_walkin")], badge: "top rated", rating: 4.98, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 2, bathrooms: 2, area: "1100 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "condo", laundry: "w/d in unit", parking: "off-street parking", cats_ok: true, dogs_ok: true, no_smoking: true, air_conditioning: true, wheelchair_accessible: true, ev_charging: true } },
  { id: "hs-6", price: "$1,800/mo", title: "warehouse loft north loop – 14ft ceilings!!", hood: "north loop", dist: "5.8 mi", time: "4h", image: img("warehouse_loft"), images: [img("warehouse_loft"), img("livingroom_loft"), img("kitchen_island"), img("bedroom_bright"), img("staircase")], rating: 4.9, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 2, bathrooms: 1, area: "1400 ft²", rent_period: "monthly", availability: "beyond_30_days", housing_type: "loft", laundry: "w/d in unit", parking: "off-street parking", cats_ok: true, dogs_ok: false, no_smoking: true, air_conditioning: true } },
  { id: "hs-7", price: "$1,150/mo", title: "2br dinkytown – walk to u of m, laundry in bldg", hood: "dinkytown", dist: "7.2 mi", time: "6h", image: img("apt_dinkytown"), images: [img("apt_dinkytown"), img("bedroom_cozy"), img("kitchen_white"), img("hallway_apt")], category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 2, bathrooms: 1, area: "850 ft²", rent_period: "monthly", housing_type: "apartment", laundry: "laundry in bldg", parking: "street parking", cats_ok: false, dogs_ok: false, no_smoking: true, air_conditioning: false } },
  { id: "hs-8", price: "$1,700/mo", title: "highrise 1br – 12th fl, views, doorman, parking incl", hood: "downtown", dist: "1.9 mi", time: "1d", image: img("apt_city"), images: [img("apt_city"), img("livingroom_open"), img("bedroom_minimal"), img("bathroom_lux"), img("balcony_view")], rating: 4.88, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 1, bathrooms: 1, area: "720 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "apartment", laundry: "w/d in unit", parking: "valet parking", cats_ok: true, dogs_ok: false, no_smoking: true, air_conditioning: true } },
  { id: "hs-9", price: "$1,450/mo", title: "2br w lake view – balcony, new bath, quiet", hood: "linden hills", dist: "10.6 mi", time: "2d", image: img("apt_lake"), images: [img("apt_lake"), img("livingroom_warm"), img("bathroom_tile"), img("bedroom_cozy"), img("sunroom")], badge: "guest favorite", rating: 4.95, category: "housing", subcategory: "apartments / housing for rent", attributes: { bedrooms: 2, bathrooms: 1, area: "900 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "apartment", laundry: "w/d in unit", parking: "off-street parking", cats_ok: true, dogs_ok: true, no_smoking: true, air_conditioning: true } },
  // real estate (4)
  { id: "hs-10", price: "$349,000", title: "craftsman bungalow 3br/2ba – original woodwork, new kitchen", hood: "powderhorn", dist: "4.1 mi", time: "3d", image: img("bungalow"), images: [img("bungalow"), img("bungalow2"), img("kitchen_modern"), img("bungalow3"), img("bungalow4")], rating: 4.9, category: "housing", subcategory: "real estate", attributes: { bedrooms: 3, bathrooms: 2, area: "1650 ft²", housing_type: "house", laundry: "w/d in unit", parking: "detached garage", no_smoking: true, air_conditioning: true } },
  { id: "hs-11", price: "$425,000", title: "lakefront 4br", hood: "mankato", dist: "67 mi", time: "1d", image: img("house_lake"), images: [img("house_lake"), img("livingroom_open"), img("kitchen_island"), img("bedroom_master"), img("pool_backyard")], category: "housing", subcategory: "real estate", attributes: { bedrooms: 4, bathrooms: 2, area: "2700 ft²", housing_type: "house", laundry: "laundry in bldg", parking: "detached garage", no_smoking: true, air_conditioning: true } },
  { id: "hs-12", price: "$289,000", title: "colonial – 3br, big yard, 2 car garage. move in ready!!", hood: "northfield", dist: "36 mi", time: "5h", image: img("colonial_house"), images: [img("colonial_house"), img("kitchen_dark"), img("fireplace"), img("bedroom_bright"), img("yard_fence"), img("garage_2car")], category: "housing", subcategory: "real estate", attributes: { bedrooms: 3, bathrooms: 2, area: "2100 ft²", housing_type: "house", laundry: "w/d in unit", parking: "detached garage", no_smoking: true, air_conditioning: true } },
  { id: "hs-13", price: "$265,000", title: "rambler 2br/1ba – finished bsmt, quiet street", hood: "faribault", dist: "47 mi", time: "2d", image: img("rambler_house"), images: [img("rambler_house"), img("livingroom_bright"), img("kitchen_white"), img("office_home"), img("porch_front")], category: "housing", subcategory: "real estate", attributes: { bedrooms: 2, bathrooms: 1, area: "1200 ft²", housing_type: "house", laundry: "w/d in unit", parking: "attached garage", no_smoking: true, air_conditioning: true } },
  // rooms & shares (3)
  { id: "hs-14", price: "$650/mo", title: "room in 4br house – utils incl, bus stop 1 block", hood: "powderhorn", dist: "3.6 mi", time: "4h", image: img("shared_room"), images: [img("shared_room"), img("kitchen_white"), img("dining_open"), img("mudroom")], category: "housing", subcategory: "rooms & shares", attributes: { bedrooms: 1, bathrooms: 1, area: "120 ft²", rent_period: "monthly", move_in_date: "4/15/2026", availability: "within_30_days", housing_type: "house", laundry: "w/d in unit", parking: "off-street parking", private_room: true, private_bath: false, furnished: false, no_smoking: true } },
  { id: "hs-15", price: "$750/mo", title: "private room – furnished, chill roommates, no pets sorry", hood: "uptown", dist: "2.2 mi", time: "1h", image: img("private_room"), images: [img("private_room"), img("bathroom_tile"), img("dining_area"), img("entryway")], badge: "just listed", category: "housing", subcategory: "rooms & shares", attributes: { bedrooms: 1, bathrooms: 1, area: "140 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "apartment", laundry: "laundry in bldg", parking: "off-street parking", private_room: true, private_bath: true, furnished: true, no_smoking: true, posted_today: true } },
  { id: "hs-16", price: "$700/mo", title: "furnished room – month to month ok, wifi incl", hood: "northeast", dist: "8.4 mi", time: "6h", image: img("room_for_rent"), images: [img("room_for_rent"), img("kitchen_dark"), img("livingroom_warm")], category: "housing", subcategory: "rooms & shares", attributes: { bedrooms: 1, bathrooms: 1, area: "130 ft²", rent_period: "monthly", availability: "within_30_days", housing_type: "apartment", laundry: "laundry on site", parking: "street parking", private_room: true, private_bath: false, furnished: true, no_smoking: true } },
  // sublets & temporary (1)
  { id: "hs-17", price: "$1,200/mo", title: "summer sublet june-aug – 1br furnished, near campus", hood: "dinkytown", dist: "6.1 mi", time: "1d", image: img("sublets"), images: [img("sublets"), img("bedroom_minimal"), img("kitchen_modern"), img("bathroom_vanity")], category: "housing", subcategory: "sublets & temporary", attributes: { bedrooms: 1, bathrooms: 1, area: "600 ft²", rent_period: "weekly", availability: "beyond_30_days", housing_type: "apartment", laundry: "w/d in unit", parking: "off-street parking", furnished: true, no_smoking: true } },
];

// ── Services (10) ───────────────────────────────────────────────────────────
export const servicesListings: ListingData[] = [
  // creative (3)
  { id: "sv-1", price: "$50/hr", title: "graphic design – logos, flyers, social. fast turnaround", hood: "northeast", dist: "5.3 mi", time: "2h", image: img("design_svc"), category: "services", subcategory: "small biz ads", attributes: { posted_today: true } },
  { id: "sv-2", price: "$75/hr", title: "video production", hood: "downtown", dist: "2.4 mi", time: "5h", image: img("video_svc"), category: "services", subcategory: "small biz ads" },
  { id: "sv-3", price: "$40/hr", title: "illustration – portraits, book covers, editorial work", hood: "uptown", dist: "8.7 mi", time: "1d", image: img("illustration_svc"), category: "services", subcategory: "small biz ads", attributes: { posted_today: true } },
  // cell phone / mobile (2)
  { id: "sv-4", price: "$49–$89", title: "phone repair – screens, batteries. same day when possible", hood: "downtown", dist: "1.9 mi", time: "3h", image: img("phone_repair"), badge: "top rated", category: "services", subcategory: "cell phone / mobile services" },
  { id: "sv-5", price: "$59–$129", title: "screen replacement iphone & samsung – oem parts 90 day warranty", hood: "northeast", dist: "11.5 mi", time: "8h", image: img("screen_replace"), category: "services", subcategory: "cell phone / mobile services", attributes: { posted_today: true } },
  // real estate (2)
  { id: "sv-6", price: "contact", title: "property mgmt – screening, maintenance, rent collection", hood: "rochester", dist: "75 mi", time: "4h", image: img("property_mgmt"), category: "services", subcategory: "real estate services" },
  { id: "sv-7", price: "free consult", title: "realtor – first time buyers welcome!", hood: "uptown", dist: "6.1 mi", time: "1d", image: img("realestate_svc"), category: "services", subcategory: "real estate services" },
  // writing / editing / translation (3)
  { id: "sv-8", price: "$0.15/word", title: "copywriting – web, email, seo. professional quality", hood: "uptown", dist: "4.1 mi", time: "6h", image: img("copywriting_svc"), category: "services", subcategory: "writing / editing / translation" },
  { id: "sv-9", price: "$150/resume", title: "resume + linkedin – ats optimized. get more interviews!", hood: "downtown", dist: "3.5 mi", time: "2h", image: img("resume_svc"), category: "services", subcategory: "writing / editing / translation", attributes: { posted_today: true } },
  { id: "sv-10", price: "$0.12/word", title: "translation – spanish french german. certified.", hood: "shakopee", dist: "18 mi", time: "1d", image: img("translation_svc"), category: "services", subcategory: "writing / editing / translation" },
];

// ── Gigs (8) ────────────────────────────────────────────────────────────────
export const gigsListings: ListingData[] = [
  // creative (3)
  { id: "gg-1", price: "$300–$500", title: "need logo for small biz – modern, clean", hood: "downtown", dist: "2.6 mi", time: "2h", image: img("logo_gig"), category: "gigs", subcategory: "creative gigs", attributes: { paid: true } },
  { id: "gg-2", price: "$200/event", title: "photographer – corp holiday party ~3hrs", hood: "north loop", dist: "4.8 mi", time: "4h", image: img("event_photo"), category: "gigs", subcategory: "creative gigs", attributes: { paid: true, posted_today: true } },
  { id: "gg-3", price: "$400–$600", title: "startup branding – full identity, logo + colors + guidelines", hood: "northeast", dist: "9.2 mi", time: "1d", image: img("branding_gig"), category: "gigs", subcategory: "creative gigs", attributes: { paid: true } },
  // computer (3)
  { id: "gg-4", price: "$500–$1,000", title: "website redesign – 5 pages, mobile. small business.", hood: "uptown", dist: "7.1 mi", time: "5h", image: img("website_gig"), category: "gigs", subcategory: "computer gigs", attributes: { paid: true } },
  { id: "gg-5", price: "$300–$500", title: "wp migration – new host, preserve seo", hood: "shakopee", dist: "18 mi", time: "8h", image: img("wp_migration"), category: "gigs", subcategory: "computer gigs", attributes: { paid: true } },
  { id: "gg-6", price: "$800–$1,500", title: "booking app – ios + android. simple scope.", hood: "woodbury", dist: "15 mi", time: "2d", image: img("app_dev_gig"), category: "gigs", subcategory: "computer gigs", attributes: { paid: true } },
  // writing (2)
  { id: "gg-7", price: "$0.10/word", title: "blog writer – weekly, tech/lifestyle", hood: "northeast", dist: "6.3 mi", time: "3h", image: img("blog_writer"), category: "gigs", subcategory: "writing gigs", attributes: { paid: false } },
  { id: "gg-8", price: "$5/listing", title: "need product descriptions – 200 skus, ecommerce, seo", hood: "downtown", dist: "2.2 mi", time: "6h", image: img("product_writer"), category: "gigs", subcategory: "writing gigs", attributes: { paid: true } },
  // labor gigs (1)
  { id: "gg-9", price: "$25/hr", title: "moving help – 2-3 hrs, furniture + boxes. this saturday", hood: "uptown", dist: "3.1 mi", time: "4h", image: img("labor"), category: "gigs", subcategory: "labor gigs", attributes: { paid: true } },
  // event gigs (1)
  { id: "gg-10", price: "$200/event", title: "wedding photog july 15 – 6hr coverage", hood: "edina", dist: "8.2 mi", time: "1d", image: img("event_photo"), category: "gigs", subcategory: "event gigs", attributes: { paid: true } },
];

// ── Resumes (8) ──────────────────────────────────────────────────────────────
export const resumesListings: ListingData[] = [
  { id: "rs-1", title: "senior ux designer – 8 yrs, figma, design systems", hood: "downtown", dist: "2.1 mi", time: "1h", image: img("uidesigner"), category: "resumes", attributes: { education_completed: "bachelors", available_weekdays: true, available_evenings: true, posted_today: true } },
  { id: "rs-2", title: "full-stack developer – react, node, aws. 5 yrs exp", hood: "north loop", dist: "4.2 mi", time: "3h", image: img("fullstackdev"), category: "resumes", attributes: { education_completed: "masters", available_weekdays: true, available_weekends: true } },
  { id: "rs-3", title: "graphic designer – branding, print, digital", hood: "northeast", dist: "6.8 mi", time: "5h", image: img("graphicdesigner"), category: "resumes", attributes: { education_completed: "bachelors", available_afternoons: true, available_evenings: true } },
  { id: "rs-4", title: "data analyst – sql, python, tableau. finance background", hood: "uptown", dist: "3.5 mi", time: "2h", image: img("dataanalyst"), category: "resumes", attributes: { education_completed: "bachelors", available_weekdays: true } },
  { id: "rs-5", title: "line cook – 3 yrs kitchen exp, fast learner", hood: "downtown", dist: "1.8 mi", time: "4h", image: img("linecook"), category: "resumes", attributes: { education_completed: "high school/GED", available_mornings: true, available_afternoons: true, available_evenings: true, available_overnight: true } },
  { id: "rs-6", title: "qa engineer – manual + automation, selenium", hood: "edina", dist: "9.1 mi", time: "6h", image: img("qaengineer"), category: "resumes", attributes: { education_completed: "associates", available_weekdays: true } },
  { id: "rs-7", title: "creative director – 12 yrs, agency + in-house", hood: "woodbury", dist: "14 mi", time: "1d", image: img("creativedirector"), category: "resumes", attributes: { education_completed: "masters", available_weekdays: true } },
  { id: "rs-8", title: "devops engineer – k8s, terraform, ci/cd", hood: "shakopee", dist: "17 mi", time: "2d", image: img("devops"), category: "resumes", attributes: { education_completed: "bachelors", available_weekdays: true, available_weekends: true, posted_today: true } },
];

// ── Community (8) ───────────────────────────────────────────────────────────
export const communityListings: ListingData[] = [
  { id: "cm-1", title: "lost: car keys – north loop parking ramp, toyota fob", hood: "north loop", dist: "4.2 mi", time: "1h", image: img("lost_keys"), category: "community", subcategory: "lost & found", attributes: { lost_or_found: "lost", posted_today: true } },
  { id: "cm-2", title: "found: blue trek bike – chained near coffee shop, dinkytown", hood: "dinkytown", dist: "6.1 mi", time: "3h", image: img("found_bike"), category: "community", subcategory: "lost & found", attributes: { lost_or_found: "found" } },
  { id: "cm-3", title: "lost: wallet – black leather, id inside. reward!!", hood: "downtown", dist: "2.1 mi", time: "5h", image: img("bike"), category: "community", subcategory: "lost & found", attributes: { lost_or_found: "lost", posted_today: true } },
  { id: "cm-4", title: "found: dog – golden retriever, linden hills area", hood: "linden hills", dist: "9.8 mi", time: "2h", image: img("patio"), category: "community", subcategory: "lost & found", attributes: { lost_or_found: "found", posted_today: true } },
  { id: "cm-5", title: "local art walk – northeast, saturday 2pm", hood: "northeast", dist: "5.3 mi", time: "1d", image: img("community_event"), category: "community", subcategory: "events", attributes: { posted_today: true } },
  { id: "cm-6", title: "seeking running buddy – uptown, mornings", hood: "uptown", dist: "3.2 mi", time: "4h", image: img("artists"), category: "community", subcategory: "activity partners" },
  { id: "cm-7", title: "lost: airpods case – grey, loring park bench", hood: "loring park", dist: "1.8 mi", time: "6h", image: img("record"), category: "community", subcategory: "lost & found", attributes: { lost_or_found: "lost" } },
  { id: "cm-8", title: "found: umbrella – black, target downtown", hood: "downtown", dist: "2.4 mi", time: "2d", image: img("boxes"), category: "community", subcategory: "lost & found", attributes: { lost_or_found: "found" } },
];

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY LOOKUP
// ═══════════════════════════════════════════════════════════════════════════

const categoryMap: Record<string, ListingData[]> = {
  "for-sale": forSaleListings,
  jobs: jobListings,
  housing: housingListings,
  services: servicesListings,
  gigs: gigsListings,
  resumes: resumesListings,
  community: communityListings,
};

// ── Subcategory counts and curated subcategory cards (real DB subcategories) ──
// Counts are filtered by default 25-mile distance from Minneapolis so "all CL" card counts
// match the actual results when drilling down with default filters.
const DEFAULT_DISTANCE_MILES = 25;
const CENTER = { lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng };

function filterByDistance(listings: ListingData[], maxMiles: number): ListingData[] {
  return listings.filter((l) => {
    const coords = getListingCoords(l, CENTER);
    const miles = haversineMiles(CENTER.lat, CENTER.lng, coords.lat, coords.lng);
    return miles <= maxMiles;
  });
}

function countBySubcategory(listings: ListingData[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const l of listings) {
    const sub = l.subcategory ?? "general";
    counts[sub] = (counts[sub] ?? 0) + 1;
  }
  return counts;
}

const jobCounts = countBySubcategory(filterByDistance(jobListings, DEFAULT_DISTANCE_MILES));
const servicesCounts = countBySubcategory(filterByDistance(servicesListings, DEFAULT_DISTANCE_MILES));
const gigsCounts = countBySubcategory(filterByDistance(gigsListings, DEFAULT_DISTANCE_MILES));
const forSaleCounts = countBySubcategory(filterByDistance(forSaleListings, DEFAULT_DISTANCE_MILES));
const housingCounts = countBySubcategory(filterByDistance(housingListings, DEFAULT_DISTANCE_MILES));

const servicesMicroAll: ListingData[] = [
  { id: "svc-1", title: "small biz ads", subtitle: `${servicesCounts["small biz ads"] ?? 0} available`, image: img("photography"), linkType: "subcategory", browseCategory: "services", browseSubcategory: "small biz ads" },
  { id: "svc-2", title: "lessons & tutoring", subtitle: `${servicesCounts["lessons & tutoring"] ?? 0} available`, image: img("tutoring"), linkType: "subcategory", browseCategory: "services", browseSubcategory: "lessons & tutoring" },
  { id: "svc-3", title: "cell phone / mobile services", subtitle: `${servicesCounts["cell phone / mobile services"] ?? 0} available`, image: img("phone_repair"), linkType: "subcategory", browseCategory: "services", browseSubcategory: "cell phone / mobile services" },
  { id: "svc-4", title: "household services", subtitle: `${servicesCounts["household services"] ?? 0} available`, image: img("cleaning"), linkType: "subcategory", browseCategory: "services", browseSubcategory: "household services" },
  { id: "svc-5", title: "real estate services", subtitle: `${servicesCounts["real estate services"] ?? 0} available`, image: img("realestate_svc"), linkType: "subcategory", browseCategory: "services", browseSubcategory: "real estate services" },
  { id: "svc-6", title: "writing / editing / translation", subtitle: `${servicesCounts["writing / editing / translation"] ?? 0} available`, image: img("copywriting_svc"), linkType: "subcategory", browseCategory: "services", browseSubcategory: "writing / editing / translation" },
];
servicesMicro = servicesMicroAll.filter((c) => (servicesCounts[c.browseSubcategory!] ?? 0) > 0);

const jobsRamseyAll: ListingData[] = [
  { id: "job-1", title: "art/media/design", subtitle: `${jobCounts["art/media/design"] ?? 0} jobs`, image: img("graphicdesigner"), linkType: "subcategory", browseCategory: "jobs", browseSubcategory: "art/media/design" },
  { id: "job-2", title: "web/html/info design", subtitle: `${jobCounts["web/html/info design"] ?? 0} jobs`, image: img("frontenddev"), linkType: "subcategory", browseCategory: "jobs", browseSubcategory: "web/html/info design" },
  { id: "job-3", title: "software/qa/dba/etc", subtitle: `${jobCounts["software/qa/dba/etc"] ?? 0} jobs`, image: img("fullstackdev"), linkType: "subcategory", browseCategory: "jobs", browseSubcategory: "software/qa/dba/etc" },
  { id: "job-4", title: "food/beverage/hospitality", subtitle: `${jobCounts["food/beverage/hospitality"] ?? 0} jobs`, image: img("restaurant"), linkType: "subcategory", browseCategory: "jobs", browseSubcategory: "food/beverage/hospitality" },
];
jobsRamsey = jobsRamseyAll.filter((c) => (jobCounts[c.browseSubcategory!] ?? 0) > 0);

const communityCounts = countBySubcategory(communityListings);
const communitySlidesAll: ListingData[] = [
  { id: "slide-1", title: "free stuff", subtitle: `${forSaleCounts["free stuff"] ?? 0} available`, image: img("free"), linkType: "subcategory", browseCategory: "for sale", browseSubcategory: "free stuff" },
  { id: "slide-2", title: "artists", subtitle: `${communityCounts["artists"] ?? 0} available`, image: img("artists"), linkType: "subcategory", browseCategory: "community", browseSubcategory: "artists" },
  { id: "slide-3", title: "sublets & temporary", subtitle: `${housingCounts["sublets & temporary"] ?? 0} available`, image: img("sublets"), linkType: "subcategory", browseCategory: "housing", browseSubcategory: "sublets & temporary" },
];
communitySlides = communitySlidesAll.filter((c) => {
  const count = c.browseCategory === "community" ? (communityCounts[c.browseSubcategory!] ?? 0) : c.browseCategory === "for sale" ? (forSaleCounts[c.browseSubcategory!] ?? 0) : (housingCounts[c.browseSubcategory!] ?? 0);
  return count > 0;
});

const gigsMicroAll: ListingData[] = [
  { id: "gig-1", title: "labor gigs", subtitle: `${gigsCounts["labor gigs"] ?? 0} gigs`, image: img("labor"), linkType: "subcategory", browseCategory: "gigs", browseSubcategory: "labor gigs" },
  { id: "gig-2", title: "creative gigs", subtitle: `${gigsCounts["creative gigs"] ?? 0} gigs`, image: img("creative"), linkType: "subcategory", browseCategory: "gigs", browseSubcategory: "creative gigs" },
  { id: "gig-3", title: "event gigs", subtitle: `${gigsCounts["event gigs"] ?? 0} gigs`, image: img("events"), linkType: "subcategory", browseCategory: "gigs", browseSubcategory: "event gigs" },
  { id: "gig-4", title: "computer gigs", subtitle: `${gigsCounts["computer gigs"] ?? 0} gigs`, image: img("computer"), linkType: "subcategory", browseCategory: "gigs", browseSubcategory: "computer gigs" },
  { id: "gig-5", title: "writing gigs", subtitle: `${gigsCounts["writing gigs"] ?? 0} gigs`, image: img("writing"), linkType: "subcategory", browseCategory: "gigs", browseSubcategory: "writing gigs" },
];
gigsMicro = gigsMicroAll.filter((c) => (gigsCounts[c.browseSubcategory!] ?? 0) > 0);

export { servicesMicro, jobsRamsey, communitySlides, gigsMicro };

export function getListingsForCategory(category: string): ListingData[] {
  return categoryMap[category] ?? [];
}

export const allListings: ListingData[] = Object.values(categoryMap).flat();

function matchesTerm(listing: ListingData, lower: string): boolean {
  return (
    listing.title.toLowerCase().includes(lower) ||
    (listing.subcategory?.toLowerCase().includes(lower) ?? false) ||
    (listing.hood?.toLowerCase().includes(lower) ?? false) ||
    (listing.price?.toLowerCase().includes(lower) ?? false)
  );
}

export function searchAllListings(term: string): ListingData[] {
  const lower = term.toLowerCase();
  return allListings.filter((l) => matchesTerm(l, lower));
}

export function searchCategoryListings(category: string, term: string, subcategory?: string | null): ListingData[] {
  const lower = term.toLowerCase();
  return getListingsForCategory(category).filter((l) => {
    if (subcategory && l.subcategory !== subcategory) return false;
    return matchesTerm(l, lower);
  });
}

/** @deprecated use getListingsForCategory() instead */
export const categoryListings = forSaleListings;
