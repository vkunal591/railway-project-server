import AssetsService from "#services/assets";
import httpStatus from "#utils/httpStatus";
import asyncHandler from "#utils/asyncHandler";
import { sendResponse } from "#utils/response";

export const get = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const filter = req.query;
  const data = await AssetsService.get(id, filter);
  sendResponse(httpStatus.OK, res, data, "Record fetched successfully");
});

export const listAssets = asyncHandler(async (req, res) => {
  const data = await AssetsService.findAllAssets(req.query);
  sendResponse(httpStatus.OK, res, data, "Assets fetched successfully");
});

export const create = asyncHandler(async function (req, res, _next) {
  const createdDoc = await AssetsService.create(req.body);
  sendResponse(
    httpStatus.CREATED,
    res,
    createdDoc,
    "Record created successfully",
  );
});

export const update = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const updatedDoc = await AssetsService.update(id, req.body);
  sendResponse(httpStatus.OK, res, updatedDoc, "Record updated successfully");
});

export const deleteData = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const deletedDoc = await AssetsService.deleteDoc(id);
  sendResponse(httpStatus.OK, res, deletedDoc, "Record deleted successfully");
});