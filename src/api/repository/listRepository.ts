import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { ListRepositoryInput } from "../../types/InputTypes";
import { Octokit } from "octokit";
import { iterate } from "../../utils/cleanData";

export const listRepository = async (req: Request, res: Response) => {
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
        const body = req.body as ListRepositoryInput;
        if (body.username) {
            const repoList = await githubClient.rest.repos.listForUser({
                username: body.username,
                type: "owner",
                per_page: 100
            });
            // remove all fields from each element that contain "https:://api.github.com/" in them
            repoList.data = repoList.data.map((repo) => {
                iterate(repo);
                return repo;
            });
            res.status(200).send({
                error: false,
                message: "Data found",
                data: repoList.data,
            });
        }
        else {
            const repoList = await githubClient.rest.repos.listForAuthenticatedUser({
                type: "owner",
            });
            repoList.data = repoList.data.map((repo) => {
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

export const getRepositoryWith5StarsAnd5Forks = async (req: Request, res: Response) => {
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
        const body = req.body as ListRepositoryInput;
        if (body.username) {
            const repoList = await githubClient.rest.repos.listForUser({
                username: body.username,
                type: "owner",
            });
            const filteredRepoList = repoList.data.filter(repo => {
                return repo.stargazers_count >= 5 && repo.forks_count >= 5;
            });
            filteredRepoList.map((repo) => {
                iterate(repo);
                return repo;
            });
            res.status(200).send({
                error: false,
                message: "Data found",
                data: filteredRepoList
            });
        }
        else {
            const repoList = await githubClient.rest.repos.listForAuthenticatedUser({
                type: "owner",
            });
            repoList.data = repoList.data.map((repo) => {
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