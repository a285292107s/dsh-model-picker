# 改坏验证 — §5.18 anchor loss

Each mutation breaks one decision the fix rests on, and the gate has to notice.
Run: `node scripts/mutate-anchor-loss.mjs`

| # | 改动 | 期望 |
|---|------|------|
| 1 | `setTimeout(confirm, …)` → `requestAnimationFrame(confirm)` | 红灯（原缺陷：确认永远不跑，弹窗不关） |
| 2 | 观察对象 `rootRef.current` → `triggerRef.current` | 红灯（锚点级探测） |
| 3 | `setSettingsAt(false)` 删除 | 红灯（三个一起关） |
| 4 | `if (!open && …) return` 删除 | 红灯（只在打开时监听） |
| 5 | `getClientRects().length > 0` → `isConnected` | 红灯（`display:none` 时仍为 true） |
| 6 | `observer.disconnect()` 删除 | 红灯（拆卸不彻底） |
