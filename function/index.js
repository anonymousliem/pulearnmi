import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const bucket = new gcp.storage.Bucket("bucket", {});
const archive = new gcp.storage.BucketObject("archive", {
    bucket: bucket.name,
    source: new pulumi.asset.FileAsset("./path/to/zip/file/which/contains/code"),
});
const _function = new gcp.cloudfunctions.Function("function", {
    description: "My function",
    runtime: "nodejs14",
    availableMemoryMb: 128,
    sourceArchiveBucket: bucket.name,
    sourceArchiveObject: archive.name,
    triggerHttp: true,
    entryPoint: "helloGET",
});
// IAM entry for all users to invoke the function
const invoker = new gcp.cloudfunctions.FunctionIamMember("invoker", {
    project: _function.project,
    region: _function.region,
    cloudFunction: _function.name,
    role: "roles/cloudfunctions.invoker",
    member: "allUsers",
});