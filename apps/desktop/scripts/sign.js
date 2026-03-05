const { writeFileSync, rmSync } = require("fs");
const { execSync } = require("child_process");
const { relative, join } = require("path");

module.exports = async function (configuration) {
  if (process.env.NOTESFRIEND_STAGING) return;

  const Endpoint = "https://weu.codesigning.azure.net";
  const CodeSigningAccountName = "Notesfriend";
  const CertificateProfileName = "Notesfriend";
  const FileDigest = configuration.hash.toUpperCase();
  const TimestampRfc3161 = "http://timestamp.acs.microsoft.com";
  const TimestampDigest = configuration.hash.toUpperCase();
  const Description = "The Notesfriend app";
  const DescriptionUrl = "https://notesfriend.com/";
  const FilesCatalog = createCatalog(configuration.path);

  const command = `Invoke-TrustedSigning -Endpoint "${Endpoint}" -CodeSigningAccountName "${CodeSigningAccountName}" -CertificateProfileName "${CertificateProfileName}" -FileDigest "${FileDigest}" -TimestampRfc3161 "${TimestampRfc3161}" -TimestampDigest "${TimestampDigest}" -Description "${Description}" -DescriptionUrl "${DescriptionUrl}" -FilesCatalog "${FilesCatalog}"`;

  console.debug("Signing", configuration.path, "using command", command);

  psexec(command);

  console.debug("Signed", configuration.path);

  rmSync(FilesCatalog);
};

function createCatalog(path) {
  const catalogPath = join(__dirname, "_catalog");
  writeFileSync(catalogPath, relative(__dirname, path));
  return catalogPath;
}

function psexec(cmd) {
  return execSync(cmd, {
    env: process.env,
    stdio: "inherit",
    shell: "pwsh"
  });
}
