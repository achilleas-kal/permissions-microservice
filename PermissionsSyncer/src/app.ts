import express, { Request, Response } from "express";
import cors from "cors";
import amqp from "amqplib/callback_api";

// Set RABBITMQ_URL with fallback
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, (error0, connection) => {
	if (error0) {
		throw error0;
	}

	connection.createChannel((error1, channel) => {
		if (error1) {
			throw error1;
		}

		console.log("Server2 connected to RabbitMQ successfully!");

		const queue = 'createNamespace';

		// Ensure the queue exists
		channel.assertQueue(queue, { durable: false });

		const app = express();

		app.use(
			cors({
				origin: [
					"http://localhost:3000",
					"http://localhost:8080",
					"http://localhost:4200",
				],
			})
		);

		app.use(express.json());

		// Define uptime check endpoint
		app.get("/", (req: Request, res: Response) => {
			console.log("This is server2's uptime check endpoint");
			const item = { test: "successful" };
			res.json(item);
		});

		// Consume messages from the 'testing' queue
		channel.consume("testing", (msg) => {
			if (msg) {  // Ensure msg is not null
				console.log("Msg received through broker");
				console.log(msg.content.toString());
				try {
					// Acknowledge the message
					channel.ack(msg);
					console.log("Message acknowledged.");
				} catch (error) {
					console.error("Error acknowledging message:", error);
				}
			} else {
				console.log("Received null message");
			}
		},
			{ noAck: false }
		);

		// Consume messages from RabbitMQ
		channel.consume(queue, (msg) => {
			if (msg) {
				const message = msg.content.toString();
				console.log('Received message:', message);
				try {
					// Acknowledge the message
					channel.ack(msg);
					console.log("Message acknowledged.");
				} catch (error) {
					console.error("Error acknowledging message:", error);
				}
			} else {
				console.log("Received null message");
			}
		});

		console.log("Listening on port 8001");
		app.listen(8001);

		// Gracefully close the RabbitMQ connection before exiting
		process.on("beforeExit", () => {
			console.log("Closing connection to RabbitMQ");
			connection.close();
		});
	});
});

