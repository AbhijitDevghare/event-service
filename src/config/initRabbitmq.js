const amqplib = require("amqplib");

async function initRabbitMQ() {
  try {
    const connection = await amqplib.connect(
      `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
    );
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, "topic", { durable: true });
    console.log("✅ Connected to RabbitMQ");

    return { conn: connection, channel };
  } catch (err) {
    console.warn("⚠️ RabbitMQ unavailable, events disabled:", err.message);
    return { conn: null, channel: null };
  }
}

module.exports = { initRabbitMQ };
