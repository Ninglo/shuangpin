export type PhonemeInputStatus =
    | "activate"
    | "activate-correct"
    | "activate-wrong"
    | "finished-correct"
    | "finished-wrong"
    | "unfinished";

export type Phoneme = {
    value: string;
    status: PhonemeInputStatus;
};

export type PhonemeSeqViewProps = {
    phonemeSeq: Phoneme[];
};
