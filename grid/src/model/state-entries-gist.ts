import StateEntries, { type Entry } from "./state-entries";
import { gistToken, gistId } from "@/secrets";
import { Octokit } from "octokit";

const octokit = new Octokit({ auth: gistToken });

export default class StateEntriesGist extends StateEntries {
    constructor(...args: ConstructorParameters<typeof StateEntries>) {
        super(...args);
        this.loadFromRemote().then(() => { this.fullListenerBroadcast(); });
        this.addEntry.addPostCall(this.pushToRemote.bind(this))
        this.removeEntry.addPostCall(this.pushToRemote.bind(this))
    }

    private async loadFromRemote() {
        const remoteDataRaw = await octokit.request(`GET /gists/{gist_id}`, {
            gist_id: gistId,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' }
        })

        let remoteData: {[id: string]: Entry} = {};
        try {
            // @ts-ignore
            remoteData = JSON.parse(remoteDataRaw["data"]["files"]["grid.json"]["content"])
        } catch (e) {
            throw new Error("Failed to parse remote data"+e)
        }
        this.entries = remoteData
    }

    private async pushToRemote() {
        this.entries = await this.entries;
        await octokit.request(`PATCH /gists/{gist_id}`, {
            gist_id: gistId,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' },
            files: {
                "grid.json": {
                    content: JSON.stringify(this.entries)
                }
            }
        })
    }
}