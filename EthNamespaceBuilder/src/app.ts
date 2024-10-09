import express, { Request, Response } from "express";
import cors from "cors";
import amqp from "amqplib/callback_api";
import { fetchHistory } from "./fetchHistory";

// Check if the RABBITMQ_URL exists, otherwise throw an error
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

amqp.connect(RABBITMQ_URL, (error0, connection) => {
	if (error0) {
		throw error0;
	}

	connection.createChannel((error1, channel) => {
		if (error1) {
			throw error1;
		}

		const queue = 'createNamespace';

		// Ensure the queue exists
		channel.assertQueue(queue, { durable: false, });
		channel.assertQueue('testing', { durable: false });

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

		// Define request handler for the uptime check
		app.get("/", (req: Request, res: Response) => {
			console.log("This is server1's uptime check endpoint");
			const item = { test: "successful" };
			res.json(item);
		});

		// Define request handler for sending to RabbitMQ queue
		app.get("/queue", async (req: Request, res: Response) => {
			console.log("This is to trigger a change on server 2");
			const item = { test: "server1" };
			const stringified_data = JSON.stringify(item);
			// Send message to RabbitMQ queue
			channel.sendToQueue("testing", Buffer.from(stringified_data), {
				persistent: false,
			});
			res.json(item);
		});

		// Endpoint to fetch Ethereum history, process data, and send to Server 2 via RabbitMQ
		app.get('/fetch-history', async (req, res) => {
			const { contractAddress, Denom, wasm_hook, mints_paused, sends_paused, burns_paused } = req.query;


			try {
				const history = await fetchHistory({ contractAddress, Denom });
				//res.json(history);

				// Send the processed data to RabbitMQ
				const dataToSend = JSON.stringify(history);
				channel.sendToQueue(queue, Buffer.from(dataToSend), {
					persistent: false,
				});


				console.log('Processed data sent to Server 2 via RabbitMQ');
				res.json({ message: 'History fetched and data sent to Server 2.' });
			} catch (error) {
				console.error('Error fetching history or sending data:', error);
				res.status(500).send('Error fetching history or sending data');
			}
		});

		app.get("/monitor", async (req: Request, res: Response) => {
			console.log("This is to skip the history collection and go straight into monitoring mode");
			console.log("this is unfinished");
			const item = { "monitoring_status": "active" };
			res.json(item);
		});

		console.log("Listening to port 8000");
		app.listen(8000);

		// Gracefully close the RabbitMQ connection before exiting
		process.on("beforeExit", () => {
			console.log("Closing connection to RabbitMQ");
			connection.close();
		});
	});
});

