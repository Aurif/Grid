import { gistId, gistToken } from '@/secrets'
import { Octokit } from 'octokit'
import { ref, watch, type Ref } from 'vue'
import DataStore from './data-store'

const octokit = new Octokit({ auth: gistToken })

async function preloadData() {
  const remoteDataRaw = await octokit.request(`GET /gists/{gist_id}`, {
    gist_id: gistId,
    headers: { 'X-GitHub-Api-Version': '2022-11-28' }
  })

  let remoteData: any = {}
  try {
    remoteData = remoteDataRaw['data']['files']
  } catch (e) {
    throw new Error('Failed to load remote data' + e)
  }
  return remoteData
}

const preloadedData = preloadData()

export default class DataStoreGist<T extends {}> extends DataStore<T> {
  private static storeCache: { [key: string]: DataStoreGist<any> } = {}
  private readonly filename: string
  private readonly dataRef: Ref<T>

  private constructor(data: T, filename: string) {
    super()
    this.dataRef = ref(data) as Ref<T>
    this.filename = filename
    watch(this.dataRef.value, (currentData) => {
      DataStoreGist.pushToRemote(currentData, this.filename)
    })
  }

  get hook(): T {
    return this.dataRef.value
  }

  static async make<T extends {}>(filename: string): Promise<DataStoreGist<T>> {
    if (!this.storeCache[filename])
      this.storeCache[filename] = new DataStoreGist<T>(await this.getFromRemote(filename), filename)
    return this.storeCache[filename]
  }

  private static async getFromRemote<T extends {}>(filename: string): Promise<T> {
    let remoteData: T = {} as T
    try {
      // @ts-ignore
      remoteData = JSON.parse((await preloadedData)[filename]['content'])
    } catch (e) {
      throw new Error('Failed to parse remote data' + e)
    }
    return remoteData
  }

  private static async pushToRemote<T extends {}>(data: T, filename: string) {
    octokit.request(`PATCH /gists/{gist_id}`, {
      gist_id: gistId,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
      files: {
        [filename]: {
          content: JSON.stringify(data)
        }
      }
    })
  }
}
