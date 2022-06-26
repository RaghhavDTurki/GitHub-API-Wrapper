import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { GetStargazersWithMoreThan2Stars } from "../../../types/InputTypes";
import { Octokit } from "octokit";
import { iterate } from "../../../utils/cleanData";

export const getStargazersWithMoreThan2Stars = async (req: Request, res: Response) => {
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
        const body = req.body as GetStargazersWithMoreThan2Stars;
        if (body.username) {
            const userMap = new Map();
            const repoList = await githubClient.rest.repos.listForUser({
                username: body.username,
                type: "owner",
            });
            for (const repo of repoList.data) {
                const stargazerList = await githubClient.request('GET /repos/{owner}/{repo}/stargazers?per_page=100', {
                    owner: body.username,
                    repo: repo.name
                })
                for (const stargazer of stargazerList.data) {
                    if (userMap.has(stargazer.login)) {
                        userMap.set(stargazer.login, userMap.get(stargazer.login) + 1);
                    }
                    else {
                        userMap.set(stargazer.login, 1);
                    }
                }
            }
            const stargazerList = [];
            for (const [key, value] of userMap.entries()) {
                if (value > 2) {
                    stargazerList.push({
                        username: key,
                        count: value
                    });
                }
            }
            res.status(200).send({
                error: false,
                message: "Data found",
                data: stargazerList
            });
        }
        else {
            const repoList = await githubClient.rest.repos.listForAuthenticatedUser({
                type: "owner",
            });
            repoList.data = repoList.data.map(repo => {
                iterate(repo)
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