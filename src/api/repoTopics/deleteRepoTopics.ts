import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { DeleteRepoTopicsInput } from "../../types/InputTypes";
import { Octokit } from "octokit";

export const deleteRepoTopics = async (req: Request, res: Response) => {
    try {
        const body = req.body as DeleteRepoTopicsInput;
        if (body.username) {
        }
        // Check for github personal access token in header
        const token = req.header("x-github-token");
        if (!token) {
            res.status(401).send({
                error: true,
                message: "Github personal access token is required",
            });
        }
        const githubClient = new Octokit({ auth: token });
        if (body.username) {
            const allTopics = await githubClient.rest.repos.getAllTopics({
                owner: body.username,
                repo: body.repo_name
            });
            if (!allTopics) {
                res.status(404).send({
                    error: true,
                    message: "No data found"
                });
                return;
            }
            const topics = allTopics.data.names;
            const topicsToBeDeleted: string[] = body.topic;
            const topicsToBeDeletedIndex: number[] = [];
            for (let i = 0; i < topicsToBeDeleted.length; i++) {
                const topicToBeDeleted = topicsToBeDeleted[i];
                const topicIndex = topics.indexOf(topicToBeDeleted);
                if (topicIndex > -1) {
                    topicsToBeDeletedIndex.push(topicIndex);
                }
            }
            const topicsToBeDeletedSorted = topicsToBeDeletedIndex.sort((a, b) => b - a);
            for (let i = 0; i < topicsToBeDeletedSorted.length; i++) {
                const topicToBeDeleted = topicsToBeDeletedSorted[i];
                topics.splice(topicToBeDeleted, 1);
            }
            const repoTopics = await githubClient.rest.repos.replaceAllTopics({
                owner: body.username,
                repo: body.repo_name,
                names: topics
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
            message: err
        });
    }
}