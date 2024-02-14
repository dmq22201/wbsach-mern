const Genre = require("../models/genre.model");

async function api(queryFromMongoose, queryFromReq, popOptions) {
  // 1) Ta cần lọc ra các trường query không cho chép từ user. Bởi vì biến queryStr sẽ lấy queryObj và đưa vào methods của Mongoodb để filter => sai
  const queryObj = { ...queryFromReq };
  const excludedFields = [
    "page",
    "sortby",
    "limit",
    "fields",
    "search",
    "genres",
    "minPrice",
    "maxPrice",
  ];

  excludedFields.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2) Ta bắt đầu tìm các documents khớp với query
  queryFromMongoose = queryFromMongoose.find(JSON.parse(queryStr));

  // Filters: LỌC
  // Filter: TÌM KIẾM
  if (queryFromReq.search) {
    queryFromMongoose = queryFromMongoose.find({
      ...JSON.parse(queryStr),
      name: {
        $regex: queryFromReq.search,
        $options: "i",
      },
    });
  }

  // Filter: thể loại
  if (queryFromReq.genres) {
    const genresArr = queryFromReq.genres.split(",");

    const genres = await Genre.find({
      slug: {
        $in: genresArr,
      },
    }).select("_id");

    queryFromMongoose = queryFromMongoose.find({
      ...JSON.parse(queryStr),
      genres: {
        $in: genres,
      },
    });
  }

  // Filter: giá min - max
  if (queryFromReq.minPrice || queryFromReq.maxPrice) {
    queryFromMongoose = queryFromMongoose.find({
      ...JSON.parse(queryStr),
      price: {
        $gte: Number(queryFromReq.minPrice),
        $lte: Number(queryFromReq.maxPrice),
      },
    });
  }

  // SAU FILTERS ta đếm tổng số lượng documents. Tại vì nếu đi qua pagination sẽ bị sai số liệu total Items. Ta cần clone query bởi vì mongoose không cho phép ta thực thi 2 lần trên 1 query
  const totalItems = await queryFromMongoose.clone();

  // SORTS: SẮP XẾP THEO...
  // SORT: sắp xếp theo fields xxx nào đó. Nếu không mặc định sắp xếp theo field createdAt
  if (queryFromReq.sortby) {
    const sortby = queryFromReq.sortby.split(",").join("");
    queryFromMongoose = queryFromMongoose.sort(sortby); // chaining methods
  } else {
    queryFromMongoose = queryFromMongoose.sort("-createdAt"); // sắp xếp giảm dần
  }

  // PAGINATION: PHÂN TRANG
  if (queryFromReq.page && queryFromReq.limit) {
    const page = queryFromReq.page * 1 || 1;
    const limit = queryFromReq.limit * 1 || 100;
    const skip = (page - 1) * limit;

    queryFromMongoose = queryFromMongoose.skip(skip).limit(limit);
  }

  // POPULATE
  if (popOptions) {
    queryFromMongoose = queryFromMongoose.populate(popOptions);
  }

  const docs = await queryFromMongoose;

  return {
    totalItems,
    docs,
  };
}

module.exports = api;
