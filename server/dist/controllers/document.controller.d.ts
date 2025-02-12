import { Request, Response } from "express";
/**
 * Handle document ingestion with external update requests
 */
export declare const ingestDocument: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Handle document status check
 */
export declare const getDocumentStatus: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
/**
 * Receive document update notifications (Client Callback)
 */
export declare const receiveUpdate: (req: Request, res: Response) => void;
