import { InjectQueue, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Data } from '../data.entity';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { DataService } from '../data.service';

@Processor('sensor-data')
export class DataConsummer {
  constructor(
    private readonly dataService: DataService,
    @InjectQueue('sensor-data') private readonly storeDataQueue: Queue,
  ) {}
  private counter = 0;

  @Process('insert')
  async insert(job: Job<unknown>) {
    this.counter++;
    const data = job.data as Data;
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'insert_data_to_DB' })
  // async insertDataToDB() {
  //   if (this.counter > 0) {
  //     // Lấy ra n công việc đã hoàn thành từ hàng đợi
  //     const jobs = await this.storeDataQueue.getJobs(
  //       ['completed'],
  //       0,
  //       this.counter - 1,
  //       true,
  //     );
  //     const numberOfJobsProcessed = jobs.length;
  //     // Chuyển đổi dữ liệu và lưu vào cơ sở dữ liệu
  //     const dataToInsert = jobs.map((job) => {
  //       const temp = JSON.parse(job.data);
  //       const data = new Data();
  //       data.temp = temp['temp'];
  //       data.hum = temp['hum'];
  //       data.light = temp['light'];
  //       return data;
  //     });
  //     await this.dataService.insertDataToDB(dataToInsert, dataToInsert.length);
  //     // Xóa các công việc đã hoàn thành khỏi hàng đợi
  //     for (const job of jobs) {
  //       await job.remove();
  //     }
  //     // Reset counter sau khi xử lý
  //     this.counter -= numberOfJobsProcessed;
  //   }
  // }
}
