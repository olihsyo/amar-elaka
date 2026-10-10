import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Fetch a page of entity records.
 * @param {string} entityName - e.g. "Business", "News"
 * @param {object} query - filter query
 * @param {object} options - { sort, limit, fields }
 */
export function useFetch(entityName, query = {}, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryKey = JSON.stringify(query);
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    base44.entities[entityName]
      .filter(query, { sort: "-created_date", limit: 50, ...options })
      .then((res) => {
        if (!cancelled) {
          setData(res.items ?? res ?? []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityName, queryKey, optionsKey]);

  return { data, loading, error };
}

/**
 * Fetch a single record by id.
 */
export function useFetchOne(entityName, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    base44.entities[entityName]
      .get(id)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [entityName, id]);

  return { data, loading, error };
}