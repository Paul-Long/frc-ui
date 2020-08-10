import chat from './chat';
import emoji from './emoji';
import chatFile from './fs';
import chatDict from './dict';
import pc from './pc';

export default (prefix: string) => [chat(prefix), emoji(prefix), chatFile(prefix), chatDict(prefix), pc(prefix)];
