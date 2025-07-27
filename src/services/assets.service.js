import Asset from "#models/assets";
import Service from "#services/base";
import mongoose from "mongoose";

class AssetsService extends Service {
  static Model = Asset;

  /**
   * Find assets with optional search and projectId
   */
  static async findAllAssets(filters = {}) {
    const {
      projectId,
      search = "",
      searchkey,
      page = 1,
      limit = 10,
      sortkey = "createdAt",
      sortdir = "desc",
    } = filters;

    const matchStage = {};

    // Filter by projectId
    if (projectId) {
      matchStage.project = new mongoose.Types.ObjectId(projectId);
    }

    // Optional text search
    if (search && searchkey) {
      matchStage[searchkey] = { $regex: search, $options: "i" };
    }

    const pipeline = [
      { $match: matchStage },
      { $sort: { [sortkey]: sortdir === "asc" ? 1 : -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const countPipeline = [
      { $match: matchStage },
      { $count: "totalCount" },
    ];

    const [results, countResult] = await Promise.all([
      this.Model.aggregate(pipeline),
      this.Model.aggregate(countPipeline),
    ]);

    const totalItems = countResult.length > 0 ? countResult[0].totalCount : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      result: results,
      pagination: {
        totalItems,
        totalPages,
        itemsPerPage: limit,
        currentPage: page,
      },
    };
  }
}

export default AssetsService;
