// Switch to the 'skintradeapp' database
db = db.getSiblingDB('skintradeapp');

// Insert Users Collection
db.users.insertMany([
  {
    _id: ObjectId("644599bf7e18bd36a88539e5"),
    firstName: "asd",
    lastName: "asd",
    email: "asd@gmail.com",
    password: "$2b$10$g40Fg2eLxlKB4zyYaP3Yg..eCzqxBAIIFySJgdj04FkMmNZPcCapm",
    __v: 0
  }
]);

// Insert Trade Items Collection
db.trade_items.insertMany([
  {
    _id: ObjectId("644599f27e18bd36a88539eb"),
    item_category: "valorant",
    item_name: "Guardian | Nebula",
    item_details: "The skin for each of the weapons, including Guardian has some unique visual finish or animation effects, but it does not affect the gameplay.",
    image: "/images/skins/valorant/guardian_nebula.png",
    disc_price: "550",
    org_price: "5570",
    created_by: ObjectId("644599bf7e18bd36a88539e5"),
    createdAt: ISODate("2023-04-23T20:49:54.317Z"),
    updatedAt: ISODate("2023-05-12T03:48:39.992Z"),
    __v: 0,
    status: "2"
  },
  {
    _id: ObjectId("6445a77d69ee384f9cb8b6bb"),
    item_category: "csgo",
    item_name: "M4A4 | Dragon King",
    item_details: "The M4A4 | 龍王 (Dragon King) was first introduced to CS:GO 8 years ago, on January 8th, 2015. It was released as part of the Chroma Case, alongside the Full Spectrum update.",
    image: "/images/skins/csgo/m4a4_dragon_king.png",
    disc_price: "1000",
    org_price: "1200",
    created_by: ObjectId("6445942625fb2f45f4994421"),
    createdAt: ISODate("2023-04-23T21:47:41.573Z"),
    updatedAt: ISODate("2023-05-12T03:39:58.946Z"),
    __v: 0,
    status: "2"
  },
  {
    _id: ObjectId("6445a7dd69ee384f9cb8b6cb"),
    item_category: "valorant",
    item_name: "Operator | Luxe",
    item_details: "Luxe Operator was first added to the game in Episode 01: Ignition. This skin is Select upgradable Operator skin.",
    image: "/images/skins/valorant/operator_luxe_blue.png",
    disc_price: "500",
    org_price: "700",
    created_by: ObjectId("6445942625fb2f45f4994421"),
    createdAt: ISODate("2023-04-23T21:49:17.387Z"),
    updatedAt: ISODate("2023-05-12T03:48:39.992Z"),
    __v: 0,
    status: "2"
  },
  {
    _id: ObjectId("64472a5ef7fb347de446d3e3"),
    item_category: "csgo",
    item_name: "AK-47 | Empress",
    item_details: "The AK-47 is one of the most popular assault rifles in the world.",
    image: "/images/skins/csgo/ak47_empress.png",
    disc_price: "1100",
    org_price: "1300",
    created_by: ObjectId("644599bf7e18bd36a88539e5"),
    createdAt: ISODate("2023-04-25T01:18:22.227Z"),
    updatedAt: ISODate("2023-05-12T03:39:58.946Z"),
    __v: 0,
    status: "2"
  },
  {
    _id: ObjectId("64472ab3f7fb347de446d3e7"),
    item_category: "valorant",
    item_name: "Spectre | Kingdom",
    item_details: "Non-upgradable skin from the Ignition: Act 1 Battlepass Chapter 1 Tier 5.",
    image: "/images/skins/valorant/spectre_kingdom.png",
    disc_price: "550",
    org_price: "750",
    created_by: ObjectId("644599bf7e18bd36a88539e5"),
    createdAt: ISODate("2023-04-25T01:19:47.718Z"),
    updatedAt: ISODate("2023-05-12T02:27:31.846Z"),
    __v: 0,
    status: "1"
  }
]);

print("Users and Trade Items Collections Initialized.");
