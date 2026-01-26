import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { Role } from '../../types/custom';

export function JwtAuth() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
  );
}

export function JwtAuthOptional() {
  return applyDecorators(
    UseGuards(OptionalJwtAuthGuard),
    ApiHeader({
      name: 'Authorization',
      required: false,
      description: 'Bearer <accessToken> (опционально)',
    }),
  );
}

export function JwtAuthAdmin() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RoleGuard),
    WithRole(Role.Admin),
    ApiBearerAuth(),
    ApiOperation({ description: 'Только для админов!' }),
  );
}

export function JwtAuthSuperAdmin() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RoleGuard),
    WithRole(Role.SuperAdmin),
    ApiBearerAuth(),
    ApiOperation({ description: 'Только для суперадминов!' }),
  );
}

export function JwtAuthAdminSuperAdmin() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RoleGuard),
    WithRole([Role.SuperAdmin,Role.Admin]),
    ApiBearerAuth(),
    ApiOperation({ description: 'Только для админов и суперадминов!' }),
  );
}

export function JwtAuthUser() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RoleGuard),
    WithRole([Role.User]),
    ApiBearerAuth(),
    ApiOperation({ description: 'Только для простых пользователей!' }),
  );
}

