import { command } from '@/common/command';
import type { DisplayStateReader } from './display-state';

export default class ScatterModel {
    renderCommand: (x: number, y: number, char: string) => void;
    state: DisplayStateReader;

    constructor(renderCommand: (x: number, y: number, char: string) => void, state: DisplayStateReader) {
        this.renderCommand = renderCommand;
        this.state = state;
    }

    findPositionForEntry(entry: string): ((offset: number, suboffset?: number) => [number, number]) | undefined {
        let horizontal: boolean, mi: number, si: number // Main and secondary axis
        let mx = this.state.columns, my = this.state.rows;

        let generatePos = (): void => {
            horizontal = Math.random() > 0.5;
            mi = Math.floor(1 + Math.random() * ((horizontal ? my : mx) - entry.length - 1));
            si = Math.floor(1 + Math.random() * ((horizontal ? mx : my) - 2));
        }
        let posToKey = (offset: number, suboffset: number=0): [number, number] => {
            return horizontal ? [mi + offset*1, si + suboffset*1] : [si + suboffset*1, mi + offset*1];
        }
        let get = (offset: number, suboffset: number=0): string => {
            return this.state.getAt(...posToKey(offset, suboffset));
        }

        let isPosValid = () => {
            if (get(-1) || get(entry.length)) return false;
            let overlap = true;
            for (let i = 0; i < entry.length; i++) {
                if (get(i) && get(i)[0] != entry[i]) return false;
                if (!get(i)) for (let j of [-1, 1]) if (get(i, j)) return false;
                if (!get(i)) overlap = false;
            }
            if (overlap) return false;
            return true;
        }
        let maxTries = 1E4;
        do { generatePos(); } while (!isPosValid() && maxTries-- > 0);
        if (maxTries <= 0) return; // TODO: Can be improved with a cyclic shuffler
        return posToKey;
    }

    @command
    displayEntry(entry: string) {
        let pos = this.findPositionForEntry(entry);
        if (!pos) throw new Error('No position found');
        for(let [i, char] of entry.split('').entries()) this.renderCommand(...pos(i), char);
    }
}