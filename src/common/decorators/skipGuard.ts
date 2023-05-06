import { SetMetadata } from '@nestjs/common';

export const SKIP_GUARD_KEY = 'isSkipGuard';
export const SkipGuard = () => SetMetadata(SKIP_GUARD_KEY, true);
