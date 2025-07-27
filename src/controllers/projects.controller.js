import ProjectsService from "#services/projects";
import httpStatus from "#utils/httpStatus";
import asyncHandler from "#utils/asyncHandler";
import { sendResponse } from "#utils/response";

export const get = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const filter = req.query;
  const data = await ProjectsService.get(id, filter);
  sendResponse(httpStatus.OK, res, data, "Record fetched successfully");
});

// 🔍 SEARCH by title (query param)
export const search = asyncHandler(async function (req, res, _next) {
  const { search } = req.query;

  if (!search || search.length < 2) {
    return sendResponse(
      httpStatus.BAD_REQUEST,
      res,
      null,
      "Query must be at least 2 characters long"
    );
  }

  const results = await ProjectsService.searchByTitle(search);
  sendResponse(httpStatus.OK, res, results, "Search completed successfully");
});


export const create = asyncHandler(async function (req, res, _next) {
  const createdDoc = await ProjectsService.create(req.body);
  sendResponse(
    httpStatus.CREATED,
    res,
    createdDoc,
    "Record created successfully",
  );
});

export const update = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  console.log(id, req.body,)
  const updatedDoc = await ProjectsService.update(id, req.body);
  sendResponse(httpStatus.OK, res, updatedDoc, "Record updated successfully");
});

export const deleteData = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const deletedDoc = await ProjectsService.deleteDoc(id);
  sendResponse(httpStatus.OK, res, deletedDoc, "Record deleted successfully");
});