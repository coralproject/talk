export default (process.env.NODE_ENV !== "development"
  ? {
      admin: "/admin",
      embed: {
        stream: "/embed/stream",
        auth: "/embed/auth",
      },
    }
  : {
      admin: "/admin.html",
      embed: {
        stream: "/stream.html",
        auth: "/auth.html",
      },
    });
