import { useEffect, useState } from 'react';
import { dataReady, tmdb, type Params } from '@/lib/tmdb';

type State<T> = { data: T | null; error: Error | null; loading: boolean };

/**
 * Load data from TMDB inside a component.
 *   const { data, loading, error } = useTmdb<TmdbList>('/movie/popular');
 * Pass `null` as the path to skip loading (e.g. an empty search).
 */
export function useTmdb<T>(path: string | null, params?: Params): State<T> {
  const enabled = dataReady && path !== null;
  const key = path + JSON.stringify(params ?? {});
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: enabled });

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, error: null, loading: false });
      return;
    }
    let cancelled = false;
    setState((s) => ({ data: s.data, error: null, loading: true }));
    tmdb<T>(path, params)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error: Error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => {
      cancelled = true;
    };
    // `key` captures path + params, so the effect reruns only when they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return state;
}
