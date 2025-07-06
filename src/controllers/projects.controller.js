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
  const updatedDoc = await ProjectsService.update(id, req.body);
  sendResponse(httpStatus.OK, res, updatedDoc, "Record updated successfully");
});

export const deleteData = asyncHandler(async function (req, res, _next) {
  const { id } = req.params;
  const deletedDoc = await ProjectsService.deleteDoc(id);
  sendResponse(httpStatus.OK, res, deletedDoc, "Record deleted successfully");
});