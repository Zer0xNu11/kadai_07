import {create} from 'zustand';

interface LoginModalStore{
  isOpen: boolean;
  onOpen: ()=>void;
  onClose: ()=> void;
}

//create ストアの作成
//

const useLoginModal = create<LoginModalStore>((set)=>({
  isOpen: false,
  onOpen: ()=>set({isOpen: true}),
  onClose: ()=>set({isOpen:false}),
}));

export default useLoginModal;