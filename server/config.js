ServiceConfiguration.configurations.remove(
  { service: "google" }
);

ServiceConfiguration.configurations.upsert(
  { service: "google" },
  { $set: {
      clientId: "388383255075-c4aclrkhm3sikvsqaq7vqhu54cc8tou9.apps.googleusercontent.com",
      secret: "oZBiu1dk4D_BsQmL7RtfA-vP",
      loginStyle: "popup"
    }
  }
);
