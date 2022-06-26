import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { CreateRepositoryInput } from "../../types/InputTypes";
import { Octokit } from "octokit";
import { iterate } from "../../utils/cleanData";

export const createRepository = async (req: Request, res: Response) => {
    try {
        // Check for github personal access token in header
        const token = req.header("x-github-token");
        if (!token) {
            res.status(401).send({
                error: true,
                message: "Github personal access token is required",
            });
            return;
        }
        const githubClient = new Octokit({ auth: token });
        const body = req.body as CreateRepositoryInput;
        if (!body.name) {
            res.status(400).send({
                error: true,
                message: "Name is required",
            });
            return;
        }
        const newRepo = await githubClient.rest.repos.createForAuthenticatedUser({
            name: body.name,
            description: body.description ? body.description : "",
            private: (body.visibility == "public") ? false : true
        })
        iterate(newRepo.data);
        res.status(200).send({
            error: false,
            message: "Repository created",
            data: newRepo.data,
        });
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        res.status(500).send({
            error: true,
            message: err.response.data
        });
    }
}
