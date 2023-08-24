const core = require("@actions/core");
const github = require("@actions/github");
import { validatePR } from "./ccc";

try {
  const payload = github.context.payload;

  let body = "";
  let title;

  if (github.context.eventName === "merge_group") {
    title = payload.merge_group.head_commit.message;
  } else {
    body = payload.pull_request.body;
    title = payload.pull_request.title;
  }

  const prTitleRegexPattern = core.getInput("pr-title-regex");
  const prBodyRegexPattern = core.getInput("pr-body-regex");

  const result = validatePR({
    title,
    body,
    prTitleRegexPattern,
    prBodyRegexPattern,
  });

  if (result.status !== "success") {
    throw result;
  }
  console.log(result.message);
} catch (error) {
  core.setFailed(error.message);
}
