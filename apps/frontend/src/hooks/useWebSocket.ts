import { useEffect, useRef, useCallback } from "react";

type WebSocketOptions = {
  protocols?: string | string[];
  onOpen?: (ws: WebSocket) => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  reconnect?: { retries?: number; intervalMs?: number };
};

export function useWebSocket<T = unknown>(
  url: string,
  onMessage: (data: T) => void,
  options?: WebSocketOptions
) {
  const ws = useRef<WebSocket | null>(null);
  const cbRef = useRef(onMessage);
  const optsRef = useRef(options);
  const retriesLeft = useRef<number>(options?.reconnect?.retries ?? 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    cbRef.current = onMessage;
    optsRef.current = options;
  }, [onMessage, options]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let socket: WebSocket | null = null;
    let closedByUser = false;

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const scheduleReconnect = () => {
      const maxRetries = optsRef.current?.reconnect?.retries ?? 0;
      if (maxRetries <= 0) return;
      if (retriesLeft.current > 0 && !isClosingRef.current) {
        const interval = optsRef.current?.reconnect?.intervalMs ?? 1000;
        retriesLeft.current -= 1;
        clearTimer();
        timerRef.current = setTimeout(connect, interval);
      }
    };

    function connect() {
      clearTimer();
      try {
        socket = new WebSocket(url, optsRef.current?.protocols);
      } catch {
        scheduleReconnect();
        return;
      }

      ws.current = socket;

      socket.onopen = () => {
        retriesLeft.current = optsRef.current?.reconnect?.retries ?? 0;
        optsRef.current?.onOpen?.(socket!);
      };

      socket.onclose = (ev) => {
        optsRef.current?.onClose?.(ev);
        ws.current = null;
        if (!closedByUser) scheduleReconnect();
      };

      socket.onerror = (ev) => {
        optsRef.current?.onError?.(ev);
      };

      socket.onmessage = (event) => {
        let parsed: unknown = event.data;
        if (typeof event.data === "string") {
          try {
            parsed = JSON.parse(event.data);
          } catch {
            /* leave as string */
          }
        }
        cbRef.current(parsed as T);
      };
    }

    connect();

    return () => {
      closedByUser = true;
      isClosingRef.current = true;
      clearTimer();
      try {
        socket?.close();
      } catch {}
      if (ws.current === socket) ws.current = null;
      isClosingRef.current = false;
    };
  }, [url]);

  const send = useCallback((data: unknown) => {
    const s = ws.current;
    if (s && s.readyState === WebSocket.OPEN) {
      s.send(typeof data === "string" ? data : JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  const close = useCallback(() => {
    try {
      ws.current?.close();
    } catch {}
  }, []);

  return { socket: ws.current, send, close };
}
