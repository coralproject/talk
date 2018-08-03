import bunyan from "bunyan";

const logger = bunyan.createLogger({
  name: "talk",
  serializers: bunyan.stdSerializers,
});

export default logger;
