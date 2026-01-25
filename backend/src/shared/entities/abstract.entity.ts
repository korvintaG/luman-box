import { Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../DDD/users/entities/user.entity';

export enum VerificationStatus {
  Creating = 0,
  ToModerate = 1,
  Moderated = 3,
  Rejected = 2,
}

export abstract class EntityID {
  @PrimaryGeneratedColumn()
  id: number;
}

export abstract class EntityIDName extends EntityID {
  @Column({ type: 'varchar'})
  name: string;
}

export abstract class EntityIDCommon extends EntityID {
  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;
}

export abstract class EntityCreation extends EntityID {
  @CreateDateColumn({ select: false })
  date_time_create: Date;

  @Column({ type: 'int', nullable: true, name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.name, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export abstract class EntityCreationName extends EntityCreation {
  @Column({ type: 'varchar'})
  name: string;
}

export abstract class EntityModerate extends EntityCreation {
  @Column({ type: 'int', nullable: false, default: VerificationStatus.Creating })
  verification_status: VerificationStatus;

  @Column({ type: 'timestamp', nullable: true, select: false })
  date_time_to_moderate: Date;

  @Column({ type: 'timestamp', nullable: true, select: false })
  date_time_moderated: Date;

  @Column({ type: 'int', nullable: true, name: 'verified_user_id', select: false })
  verified_user_id: number;

  @Column({ type: 'varchar', nullable: true, name: 'moderation_notes', select: true })
  moderation_notes: string;

  @ManyToOne(() => User, (user) => user.name, { nullable: true })
  @JoinColumn({ name: 'verified_user_id' })
  moderator: User;
} 

export abstract class EntityCommon extends EntityModerate {
  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;
}

export abstract class EntityCommonFull extends EntityCommon {
  @Column({ type: 'varchar'})
  name: string;
}