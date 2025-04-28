export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface LoadingStateWithData<T> extends LoadingState {
  data: T | null;
}

export const initialLoadingState: LoadingState = {
  loading: false,
  error: null
};

export const initialLoadingStateWithData = <T>(): LoadingStateWithData<T> => ({
  ...initialLoadingState,
  data: null
});
