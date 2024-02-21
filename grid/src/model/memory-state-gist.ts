import type { Ref } from "vue";
import MemoryState from "./memory-state";
import { gistToken, gistId } from "@/secrets";
import { Octokit } from "octokit";
import { command } from "@/common/command";

const octokit = new Octokit({ auth: gistToken });

export default class MemoryStateGist extends MemoryState {
    constructor(trigger: Ref | Ref[], listeners: ((entry: string, owner: string) => void)[]) {
        super(trigger, listeners);
        this.loadFromRemote().then(() => { this.fullListenerBroadcast(); });
    }

    async loadFromRemote() {
        let remoteDataRaw = await octokit.request(`GET /gists/{gist_id}`, {
            gist_id: gistId,
            headers: { 'X-GitHub-Api-Version': '2022-11-28' }
        })

        let remoteData: {[id: string]: string} = {};
        try {
            // @ts-ignore
            remoteData = JSON.parse(remoteDataRaw["data"]["files"]["grid.json"]["content"])
        } catch (e) {
            throw new Error("Failed to parse remote data"+e)
        }
        this.entries = remoteData
    }

    async pushToRemote() {
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

    @command
    addEntry(entry: string): void {
        super.addEntry(entry);
        this.pushToRemote();
    }
}