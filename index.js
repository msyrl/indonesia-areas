import fs from "fs/promises";

const AREA_TYPE = {
  PROVINCE: 2,
  CITY: 5,
  SUBDISTRICT: 8,
  VILLAGE: 13,
};

const main = async () => {
  const data = await getData();
  build(data);

  return 0;
};

const getData = async () => {
  const file = await fs.readFile("./src/wilayah.json", "utf8");
  return JSON.parse(file);
};

const build = (data) => {
  const areas = data.reduce(
    (acc, value) => {
      switch (value.kode.length) {
        case AREA_TYPE.PROVINCE:
          acc.provinces.push({
            code: value.kode,
            name: value.wilayah.toUpperCase(),
          });
          break;

        case AREA_TYPE.CITY:
          acc.cities.push({
            code: value.kode,
            parent: value.kode.substring(0, AREA_TYPE.PROVINCE),
            name: value.wilayah.toUpperCase(),
          });
          break;

        case AREA_TYPE.SUBDISTRICT:
          acc.subdistricts.push({
            code: value.kode,
            parent: value.kode.substring(0, AREA_TYPE.CITY),
            name: value.wilayah.toUpperCase(),
          });
          break;

        case AREA_TYPE.VILLAGE:
          acc.villages.push({
            code: value.kode,
            parent: value.kode.substring(0, AREA_TYPE.SUBDISTRICT),
            name: value.wilayah.toUpperCase(),
          });
          break;
      }

      return acc;
    },
    {
      provinces: [],
      cities: [],
      subdistricts: [],
      villages: [],
    }
  );

  for (const area in areas) {
    writeToFile(area, areas[area]);
  }
};

const writeToFile = (fileName, data) => {
  fs.writeFile(`./data/${fileName}-min.json`, JSON.stringify(data), {
    flag: "w",
  });
  fs.writeFile(`./data/${fileName}.json`, JSON.stringify(data, null, 2), {
    flag: "w",
  });
};

main();
