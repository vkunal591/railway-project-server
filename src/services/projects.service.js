import Projects from "#models/projects";
import Service from "#services/base";

class ProjectsService extends Service {
  static Model = Projects;

  static async searchByTitle(query) {
    if (!query || query.length < 2) {
      throw new Error("Search query must be at least 2 characters long.");
    }

    const regex = new RegExp(query, "i"); // case-insensitive

    return this.Model.find({ title: regex })
      .limit(20) // optional: limit number of results
      .sort({ title: 1 }) // optional: sort alphabetically
      .exec();
  }
}

export default ProjectsService;
