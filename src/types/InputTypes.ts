import { IsString } from "class-validator";

export class CreateRepositoryInput {
    @IsString()
    name: string;
    @IsString()
    description?: string;
    @IsString()
    visibility?: string;
}

export class ListRepositoryInput {
    @IsString()
    username: string;
}

export class ListRepoTopicsInput {
    @IsString()
    username: string;
    @IsString()
    repo_name: string
}

export class DeleteRepoTopicsInput extends ListRepoTopicsInput {
    @IsString()
    topic: [string];
}

export class UpdateRepoTopicsInput extends DeleteRepoTopicsInput { }

export class GetContributorsAndStargazersInput extends ListRepoTopicsInput { }

export class GetCommitFrequency extends ListRepositoryInput { }

export class GetStargazersWithMoreThan2Stars extends ListRepositoryInput { }

export class GetStargazersWithExactly2Stars extends ListRepositoryInput { }