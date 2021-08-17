"use strict";
const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("test-pulumi-bucket");

const bucketObject = new gcp.storage.BucketObject("index.html", {
    bucket: bucket.name,
    contentType: "text/html",
    source: new pulumi.asset.FileAsset("index.html"),
    website: {
        mainPageSuffix: "index.html"
    },
    uniformBucketLevelAccess: true
});

const bucketIAMBinding = new gcp.storage.BucketIAMBinding("test-pulumi-bucket", {
    bucket: bucket.name,
    role: "roles/storage.objectViewer",
    members: ["allUsers"]
});

// Export the DNS name of the bucket
exports.bucketEndpoint = pulumi.concat("http://storage.googleapis.com/", bucket.name, "/", bucketObject.name);
