type RefreshCallback = () => void

class GlobalStateManager {
  private refreshCallbacks: RefreshCallback[] = []

  subscribe(callback: RefreshCallback) {
    this.refreshCallbacks.push(callback)
    return () => {
      this.refreshCallbacks = this.refreshCallbacks.filter(cb => cb !== callback)
    }
  }

  refresh() {
    this.refreshCallbacks.forEach(callback => callback())
  }
}

export const globalState = new GlobalStateManager()