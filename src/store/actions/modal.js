export const OPEN = 'MODAL_OPEN';
export const DISMISS = 'MODAL_DISMISS';

export function dismissModal() {
   return {type: DISMISS};
}

export function openModal(component, style) {
   return {
      type: OPEN,
      payload: {component, style}
   };
}
