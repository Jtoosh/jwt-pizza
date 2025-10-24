import React from 'react';
import { useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../hooks/appNavigation';
import { pizzaService } from '../service/service';
import View from './view';
import Button from '../components/button';

export default function deleteUser() {
  const state = useLocation().state;
  const navigateToParentPath = useBreadcrumb();

  async function close() {
    await pizzaService.deleteUser(state.user);
    navigateToParentPath();
  }

  return (
    <View title='Sorry to see you go'>
      <div className='text-start py-8 px-4 sm:px-6 lg:px-8'>
        <div className='text-neutral-100'>
          Are you sure you want to delete the user <span className='text-orange-500'>{state.user.name}</span> ? This cannot be
          restored.
        </div>
        <Button title='Delete' onPress={close} />
        <Button title='Cancel' onPress={navigateToParentPath} className='bg-transparent border-neutral-300' />
      </div>
    </View>
  );
}
