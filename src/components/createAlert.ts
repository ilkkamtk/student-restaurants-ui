export default (message: string) => {
  const alertModal = document.querySelector('#alert') as HTMLDialogElement;
  const alertMessage = document.querySelector(
    '#alert-message',
  ) as HTMLParagraphElement;
  alertMessage.innerHTML = message;
  alertModal.showModal();
};
