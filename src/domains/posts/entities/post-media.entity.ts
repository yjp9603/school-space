import BaseEntity from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostMedia extends BaseEntity {
  @Column({
    comment: '이미지, 파일 등 미디어 URL',
  })
  mediaUrl: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  static from(mediaUrl: string) {
    const postMedia = new PostMedia();
    postMedia.mediaUrl = mediaUrl;
    return postMedia;
  }
}
