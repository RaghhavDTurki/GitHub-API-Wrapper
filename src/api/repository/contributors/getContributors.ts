import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { GetContributorsAndStargazersInput } from "../../../types/InputTypes";
import { Octokit } from "octokit";
import { iterate } from "../../../utils/cleanData";

export const getContributors = async (req: Request, res: Response) => {
    try {
        // Check for github personal access token in header
        const token = req.header("x-github-token");
        if (!token) {
            res.status(401).send({
                error: true,
                message: "Github personal access token is required",
            });
        }
        const githubClient = new Octokit({ auth: token });
        const body = req.body as GetContributorsAndStargazersInput;
        if (body.username) {
            const contributorList = await githubClient.rest.repos.listContributors({
                owner: body.username,
                repo: body.repo_name
            });
            if (!contributorList) {
                res.status(404).send({
                    error: true,
                    message: "No data found"
                });
                return;
            }
            const filteredData = contributorList.data.map(contributor => {
                iterate(contributor);
                return contributor;
            });
            res.status(200).send({
                error: false,
                message: "Data found",
                data: filteredData
            });
        }
        else {
            const repoList = await githubClient.rest.repos.listForAuthenticatedUser({
                type: "owner",
            });
            repoList.data = repoList.data.map(repo => {
                iterate(repo);
                return repo;
            });
            res.status(200).send({
                error: false,
                message: "Data found",
                data: repoList.data,
            });
        }
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