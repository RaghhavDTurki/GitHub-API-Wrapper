import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { GetCommitFrequency } from "../../../types/InputTypes";
import { Octokit } from "octokit";

export const getReposWithRecentCommitsByAnyone = async (req: Request, res: Response) => {
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
        const body = req.body as GetCommitFrequency;
        if (body.username) {
            const repoList = await githubClient.rest.repos.listForUser({
                username: body.username,
                type: "member",
            });
            let dataList: any[] = [];
            var date = new Date().getTime();
            var TenDaysAgo = date - 1000 * 60 * 60 * 24 * 10;
            for (const repository of repoList.data) {
                try {
                    const commits = await githubClient.rest.repos.listCommits({
                        owner: body.username,
                        repo: repository.name,
                        since: new Date(TenDaysAgo - 1000 * 60 * 60 * 24 * 2).toISOString()
                    })
                    if (commits.data.length > 5) {
                        dataList.push({
                            name: repository.name,
                            stars: repository.stargazers_count,
                            forks: repository.forks_count,
                            commits: commits.data.length
                        })
                    }
                }
                catch (err) {
                    console.log(err)
                    continue;
                }
            }
            res.status(200).send({
                error: false,
                message: "Data found",
                data: dataList,
            });

        }
        else {
            const repoList = await githubClient.rest.repos.listForAuthenticatedUser({
                type: "owner",
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