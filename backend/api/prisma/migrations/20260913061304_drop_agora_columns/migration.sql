-- DropIndex
DROP INDEX `Room_agoraToken_key` ON `Room`;

-- AlterTable
ALTER TABLE `Room` DROP COLUMN `agoraAppId`,
    DROP COLUMN `agoraToken`;

